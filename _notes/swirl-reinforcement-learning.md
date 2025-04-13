---
title: "SWiRL: Multi-Step Reasoning for LLMs"
date: 2025-04-13
tags: AI machine-learning research reinforcement-learning
---

I just read a fascinating new paper by Google researchers that solves a major problem with language models: their struggle with multi-step reasoning.

**Reference:** Goldie, A., Mirhoseini, A., Zhou, H., Cai, I., & Manning, C. D. (2024). *Synthetic Data Generation & Multi-Step RL for Reasoning & Tool Use*. arXiv preprint arXiv:2504.04736.

Here's the thing - LLMs can be amazing at individual tasks, but they often fall apart when they need to follow a sequence of connected steps. Think about answering a complex research question that requires multiple Google searches, or solving a math problem that needs several calculations. Traditional reinforcement learning only optimizes for the final answer, which isn't enough for these multi-step challenges.

## What makes SWiRL special?

The researchers introduce **Step-Wise Reinforcement Learning (SWiRL)** that fundamentally changes how we train LLMs for multi-step reasoning. The big innovation is that SWiRL optimizes **each individual step** in a reasoning chain, not just the final answer. 

This is a game-changer because:

1. It teaches models how to break down complex problems into manageable pieces
2. It rewards good reasoning even when the final answer is wrong
3. It dramatically improves performance on tasks requiring tool use

## How SWiRL works

The process has two main stages:

### Stage 1: Generate synthetic reasoning paths

```python
def generate_trajectory(llm, tool, question, max_steps):
    trajectory = []
    context = {"question": question, "history": []}
    for step in range(max_steps):
        action = llm(context)  # LLM decides to generate CoT, tool call, or answer
        trajectory.append(action)
        if "<search_query>" in action or "<math_exp>" in action:
            query = extract_query(action)
            result = tool(query)  # Execute the tool call
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

First, they use a base model (like Gemma 2) to generate a bunch of multi-step solutions for complex questions. The model gets access to tools like search engines or calculators, and can decide when to use them. This creates a dataset of reasoning paths, with some good and some not-so-good examples.

### Stage 2: Break each path into steps and optimize individually

```python
def decompose_trajectory(trajectory):
    sub_trajectories = []
    current_context = []
    for i, action in enumerate(trajectory):
        current_context.append(action)
        sub_trajectories.append(list(current_context))  # Create a sub-trajectory up to the current action
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

The really clever part is how they decompose each reasoning path into sub-trajectories. If a solution has 5 steps, they create 5 training examples - one for each decision point in the chain. This lets them reward good individual decisions even if the overall outcome wasn't perfect.

### The actual reinforcement learning magic

```python
def calculate_step_wise_reward(reward_model, sub_trajectory):
    context = sub_trajectory[:-1]
    action = sub_trajectory[-1]
    reward = reward_model(context, action)  # Reward model evaluates the action given the context
    return reward

def optimize_model_step_wise(base_model, synthetic_data, reward_model, optimizer):
    for trajectory in synthetic_data:
        sub_trajectories = decompose_trajectory(trajectory)
        for sub_trajectory in sub_trajectories:
            reward = calculate_step_wise_reward(reward_model, sub_trajectory)
            loss = -reward * base_model.log_prob(sub_trajectory)  # Policy gradient-like objective
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

A large model (Gemini 1.5 Pro in their experiments) judges the quality of each individual reasoning step, and the base model gets optimized to maximize these step-wise rewards. This approach teaches the model to make good decisions at every point in the reasoning process.

## How a SWiRL-trained model works in practice

Here's how a model trained with SWiRL would answer a question requiring multiple steps:

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
tool = SearchEngine()  # or Calculator() depending on the question type
llm_swirl_tuned = SWiRLTunedGemma2()
answer = perform_multi_step_inference(llm_swirl_tuned, tool, question, max_queries=5)
print(f"Answer: {answer}")
```

## The coolest finding: Process matters more than outcome

One fascinating discovery was that filtering trajectories based on having good individual reasoning steps (even if the final answer was wrong) produced better results than filtering based on correct final answers. They call this "process filtering":

```python
def is_step_reasonable(judge_model, sub_trajectory):
    context = sub_trajectory[:-1]
    action = sub_trajectory[-1]
    judgment = judge_model(context, action)  # Judge model (e.g., Gemini 1.5 Pro Thinking)
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

## Results that blew me away

The performance improvements from SWiRL are substantial:
- 15% average relative improvement across challenging reasoning tasks
- Strong generalization to completely different types of problems
- Training on question-answering improved math performance by 16.9%
- Training on math improved question-answering by 9.2%

This cross-task generalization is pretty mind-blowing, and suggests SWiRL is teaching fundamental reasoning abilities rather than task-specific tricks.

## Why this matters for AI development

The SWiRL approach represents a big step forward for creating AI assistants that can truly reason through complex problems. By optimizing each step of the reasoning process rather than just the final outcome, we get models that can think more clearly and use tools more effectively.

I'm excited to see how this technique evolves and gets incorporated into the next generation of AI systems! 