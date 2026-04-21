import { db } from "./index";
import { interviewTemplate } from "./schema";

async function main() {
  console.log("🌱 Seeding database with interview templates...");

  await db
    .insert(interviewTemplate)
    .values([
      // 1. The Frontend React Interview
      {
        id: "int_react_hooks_02",
        title: "React Hooks Deep Dive 2",
        description:
          "A 15-minute technical screening focusing on useEffect, custom hooks, and rendering lifecycles.",
        difficulty: "medium",
        isPremium: false,
        initialCode:
          "import React, { useState, useEffect } from 'react';\n\nexport default function App() {\n  // Fix the infinite loop below\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    setCount(count + 1);\n  });\n\n  return <div>{count}</div>;\n}",
        systemPrompt:
          "You are a strict Senior Frontend Engineer conducting a React interview. The candidate must fix the infinite loop in the provided useEffect. Do not give them the answer. Ask them to verbally explain why the missing dependency array is causing the component to re-render continuously.",
      },

      // 2. The New DSA Interview
      {
        id: "int_dsa_twosum_01",
        title: "Two Sum (Optimized)",
        description:
          "A classic 20-minute DSA screening focusing on Hash Maps, array traversal, and optimizing Time Complexity to O(n).",
        difficulty: "easy",
        isPremium: false,
        initialCode:
          "function twoSum(nums: number[], target: number): number[] {\n  // Write your optimal approach here\n  \n  return [];\n}",
        systemPrompt:
          "You are a strict Senior Software Engineer conducting a Data Structures and Algorithms interview. The candidate must solve the 'Two Sum' problem. First, keep the editor locked and ask them to verbally explain their approach. If they suggest a nested loop O(n^2), push them to optimize it using a Hash Map. Once they correctly explain the O(n) approach verbally, execute the 'unlock_code_editor' tool. After they code, evaluate their edge cases and final Big O complexities.",
      },
    ])
    .onConflictDoNothing();

  console.log(
    "✅ Seeding complete! Your dashboard now has two mock interviews.",
  );
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
