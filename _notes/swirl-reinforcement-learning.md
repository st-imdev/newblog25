---
title: "Step-Wise Reinforcement Learning (SWiRL): Empowering Language Models for Multi-Step Reasoning and Tool Use"
date: 2025-04-13
tags: AI machine-learning research reinforcement-learning
---

**Reference:** Goldie, A., Mirhoseini, A., Zhou, H., Cai, I., & Manning, C. D. (2024). *Synthetic Data Generation & Multi-Step RL for Reasoning & Tool Use*. arXiv preprint arXiv:2504.04736.

Large Language Models (LLMs) have achieved remarkable progress in Natural Language Processing. However, they often struggle with complex queries that necessitate reasoning and tool utilization across multiple steps, such as multi-hop question answering, mathematical problem-solving, and other agentic tasks. Traditional reinforcement learning (RL) approaches for LLMs have largely focused on single-step optimization, leaving the challenge of multi-step tasks unaddressed. Many real-world problems require a sequence of interrelated actions, making it critical for models to maintain accuracy throughout the entire chain of actions.

To tackle this challenge, Goldie et al. introduce **Step-Wise Reinforcement Learning (SWiRL)**, an offline multi-step optimization technique. SWiRL focuses on scenarios where a model has access to a tool, like a search engine or calculator, and needs to execute a sequence of tool calls to answer a question. The goal is to teach the model how to break down complex problems into manageable subtasks, decide when to use a tool, formulate tool queries, utilize the results, and synthesize findings effectively.

SWiRL employs a **two-stage approach**: first, it iteratively generates multi-step synthetic data, and then it learns from this data using a step-wise reinforcement learning method. This methodology offers the practical advantage of rapidly generating large amounts of training data through parallel calls, avoiding bottlenecks from slow tool execution. The offline nature of the process also enhances reproducibility.

### Step-Wise Reinforcement Learning (SWiRL) - Stage 1: Synthetic Data Generation

```python
def generate_trajectory(llm, tool, question, max_steps):
    trajectory = []
    context = {"question": question, "history": []}
    for step in range(max_steps):
        action = llm(context) # LLM decides to generate CoT, tool call, or answer
        trajectory.append(action)
        if "<search_query>" in action or "<math_exp>" in action:
            query = extract_query(action)
            result = tool(query) # Execute the tool call
            context["history"].append({"action": action, "result": result})
        elif "<answer>" in action:
            break
    return trajectory

# Example of generating multiple trajectories for a question
question = "What company published both The Scorch Trials and The Death Cure?"
tool = SearchEngine()
llm = Gemma2()
num_trajectories = 5
max_steps_qa = 5
synthetic_data = [generate_trajectory(llm, tool, question, max_steps_qa)
                  for _ in range(num_trajectories)]
```

In the first stage, a base LLM (like Gemma 2) is provided with access to a relevant tool (e.g., a search engine or calculator). The model is iteratively prompted to generate multi-step trajectories. At each step, the model can generate a chain of thought and decide to either call the tool or produce a final answer. If a tool is used, the query is extracted, executed, and the result is fed back to the model in the subsequent step. This process continues until the model provides an answer. The `generate_trajectory` function exemplifies this iterative process of generating multi-step reasoning and tool use data.

### Step-Wise Reinforcement Learning (SWiRL) - Step-Wise Decomposition

```python
def decompose_trajectory(trajectory):
    sub_trajectories = []
    current_context = []
    for i, action in enumerate(trajectory):
        current_context.append(action)
        sub_trajectories.append(list(current_context)) # Create a sub-trajectory up to the current action
        # In a real implementation, the environment response would also be part of the context
    return sub_trajectories

# Example of decomposing a generated trajectory
example_trajectory = [
    "To figure out who is older, I should first search for age of Glenn Hughes. <search_query>age of Glenn Hughes</search_query>",
    "Glenn Hughes age -> Glenn Hughes is currently 72 years old (born on August 21, 1951)",
    "Next, I should find out what Ross Lynch's age is. <search_query>Ross Lynch age</search_query>",
    "Ross Lynch age -> Ross Lynch is currently 28 years old (born on December 29, 1995)",
    "<answer>Glenn Hughes</answer>"
]
sub_trajectories = decompose_trajectory(example_trajectory)
# Each sub_trajectory now represents the context and the action at each step
```

Each generated multi-step trajectory is then broken down into multiple **sub-trajectories**. If a trajectory has *k* actions, it is converted into *k* sub-trajectories, each containing the context from the beginning of the trajectory up to that specific action. The `decompose_trajectory` function illustrates this step-wise decomposition, which is crucial for applying feedback at each individual step.

### Step-Wise Reinforcement Learning (SWiRL) - Step-Wise RL Optimization

```python
def calculate_step_wise_reward(reward_model, sub_trajectory):
    context = sub_trajectory[:-1]
    action = sub_trajectory[-1]
    reward = reward_model(context, action) # Reward model evaluates the action given the context
    return reward

def optimize_model_step_wise(base_model, synthetic_data, reward_model, optimizer):
    for trajectory in synthetic_data:
        sub_trajectories = decompose_trajectory(trajectory)
        for sub_trajectory in sub_trajectories:
            reward = calculate_step_wise_reward(reward_model, sub_trajectory)
            loss = -reward * base_model.log_prob(sub_trajectory) # Policy gradient-like objective
            optimizer.backward(loss)
            optimizer.step()
            optimizer.zero_grad()

# Simplified example of the optimization process
reward_model = Gemini1_5Pro()
base_model = Gemma2()
optimizer = Adam(base_model.parameters())
# Assuming 'process_filtered_data' is the synthetic data after filtering
# optimize_model_step_wise(base_model, process_filtered_data, reward_model, optimizer)
```

In the second stage, a **step-wise reinforcement learning approach** is used to optimize a generative base model on the synthetic sub-trajectories. A generative reward model (e.g., Gemini 1.5 Pro) evaluates the quality of each action within the context of its sub-trajectory. The `calculate_step_wise_reward` function represents this evaluation. The base model is then optimized to predict either the next intermediate step or the final response based on the preceding context, aiming to maximize the expected sum of these step-wise rewards. This granular feedback mechanism, as shown in `optimize_model_step_wise`, allows the model to learn both local decision-making and global trajectory optimization. Importantly, this process does not require golden labels.

### Step-Wise Reinforcement Learning (SWiRL) - Inference-Time Evaluation

```python
def perform_multi_step_inference(llm, tool, question, max_queries):
    context = {"question": question, "history": []}
    for _ in range(max_queries):
        response = llm(context)
        if "<search_query>" in response or "<math_exp>" in response:
            query = extract_query(response)
            result = tool(query)
            context["history"].append({"action": response, "result": result})
        elif "<answer>" in response:
            answer = extract_answer(response)
            return answer
        else:
            # Handle cases where the model doesn't produce a tool call or an answer
            context["history"].append({"action": response, "result": "no tool use"})
    return "Could not answer within the query limit."

# Example of inference
question = "Who is older Glenn Hughes or Ross Lynch?"
tool = SearchEngine() # or Calculator() depending on the question type
llm_swirl_tuned = SWiRLTunedGemma2()
answer = perform_multi_step_inference(llm_swirl_tuned, tool, question, max_queries=5)
print(f"Answer: {answer}")
```

At inference time, the SWiRL-tuned model is iteratively prompted to either call a tool or produce a final answer. The process continues, with tool queries being executed and their results fed back into the context, until an answer is generated or a maximum number of queries is reached. The `perform_multi_step_inference` function illustrates this iterative interaction, enabling the model to handle complex questions requiring external knowledge or computation.

### Step-Wise Reinforcement Learning (SWiRL) - Process Filtering

```python
def is_step_reasonable(judge_model, sub_trajectory):
    context = sub_trajectory[:-1]
    action = sub_trajectory[-1]
    judgment = judge_model(context, action) # Judge model (e.g., Gemini 1.5 Pro Thinking)
    return "GOOD" in judgment

def filter_by_process(synthetic_data, judge_model):
    process_filtered_data = []
    for trajectory in synthetic_data:
        is_reasonable = True
        sub_trajectories = decompose_trajectory(trajectory)
        for sub_trajectory in sub_trajectories:
            if not is_step_reasonable(judge_model, sub_trajectory):
                is_reasonable = False
                break
        if is_reasonable:
            process_filtered_data.append(trajectory)
    return process_filtered_data

# Example of process filtering
judge = Gemini1_5ProThinking()
# Assuming 'raw_synthetic_data' is the initially generated data
# process_filtered_data = filter_by_process(raw_synthetic_data, judge)
```

SWiRL also explores different synthetic data filtering strategies. One notable strategy is **process filtering**, where a model (like Gemini 1.5 Pro Thinking) judges the reasonableness of each step in the generated trajectories. Trajectories where every step is deemed "GOOD" are retained. Interestingly, the paper found that training on **process-only filtered data yielded the best results**, even if the final answer was incorrect. This suggests that learning from sound reasoning steps is more crucial for generalization than just focusing on correct outcomes.

### Key Findings and Innovations

The SWiRL methodology demonstrates significant improvements across various challenging multi-hop question-answering and mathematical reasoning tasks, outperforming baseline approaches by an average of 15% in relative accuracy. Notably, SWiRL exhibits strong **generalization across datasets and even disparate tasks**. For example, training only on HotPotQA (text question-answering) improves zero-shot performance on GSM8K (a math dataset) by a relative 16.9%. Conversely, training on GSM8K improves performance on HotPotQA by 9.2%.

The research also highlights the effectiveness of **process-based filtering** over outcome-based filtering for RL optimization in multi-step scenarios. Unlike supervised finetuning, SWiRL can effectively learn from trajectories with incorrect final answers and even benefits from a mixture of both correct and incorrect outcomes when the reasoning steps are sound. Furthermore, the effectiveness of SWiRL appears to grow with increased model size.

Finally, the study shows that SWiRL improves the average correctness of each step in the reasoning process, leading to better multi-step reasoning abilities that drive the downstream performance gains.

### Conclusion

Step-Wise Reinforcement Learning (SWiRL) presents an innovative and effective approach to enhancing the multi-step reasoning and tool use capabilities of large language models. By generating and learning from synthetic multi-step trajectories with a step-wise optimization and a focus on process quality, SWiRL achieves significant performance gains and strong generalization abilities across diverse and challenging tasks.

### Reference

 Goldie, A., Mirhoseini, A., Zhou, H., Cai, I., & Manning, C. D. (2024). *Synthetic Data Generation & Multi-Step RL for Reasoning & Tool Use*. arXiv preprint arXiv:2504.04736. 