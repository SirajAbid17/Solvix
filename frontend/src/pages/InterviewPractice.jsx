import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaCode,
  FaHome,
  FaLightbulb,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaTerminal,
  FaClock,
} from "react-icons/fa";
import { SiJavascript, SiPython } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../BgContext/ThemeContext";

const firstQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array / HashMap",
    time: "15 min",
    description:
      "Given an array of integers and a target value, return the indices of the two numbers whose sum equals the target.",
    javascript: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
// [0, 1]`,
    python: `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []

print(two_sum([2, 7, 11, 15], 9))
# [0, 1]`,
    testCases: [
      ["[2, 7, 11, 15], 9", "[0, 1]"],
      ["[3, 2, 4], 6", "[1, 2]"],
    ],
  },

  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    topic: "String",
    time: "10 min",
    description:
      "Write a function that takes a string and returns the string reversed without using the built-in reverse() method.",
    javascript: `function reverseString(str) {
  let result = "";

  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }

  return result;
}

console.log(reverseString("hello"));
// "olleh"`,
    python: `def reverse_string(string):
    result = ""

    for i in range(len(string) - 1, -1, -1):
        result += string[i]

    return result

print(reverse_string("hello"))
# "olleh"`,
    testCases: [
      ['"hello"', '"olleh"'],
      ['"javascript"', '"tpircsavaj"'],
    ],
  },

  {
    id: 3,
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "String / Two Pointers",
    time: "15 min",
    description:
      "Determine whether a string reads the same forward and backward.",
    javascript: `function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("madam"));
// true`,
    python: `def is_palindrome(string):
    left = 0
    right = len(string) - 1

    while left < right:
        if string[left] != string[right]:
            return False

        left += 1
        right -= 1

    return True

print(is_palindrome("madam"))
# True`,
    testCases: [
      ['"madam"', "true"],
      ['"hello"', "false"],
    ],
  },

  {
    id: 4,
    title: "Find Maximum Number",
    difficulty: "Easy",
    topic: "Array",
    time: "10 min",
    description:
      "Write a function that finds the largest number in an array without using Math.max().",
    javascript: `function findMaximum(nums) {
  let max = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) {
      max = nums[i];
    }
  }

  return max;
}

console.log(findMaximum([4, 9, 2, 15, 6]));
// 15`,
    python: `def find_maximum(nums):
    maximum = nums[0]

    for i in range(1, len(nums)):
        if nums[i] > maximum:
            maximum = nums[i]

    return maximum

print(find_maximum([4, 9, 2, 15, 6]))
# 15`,
    testCases: [
      ["[4, 9, 2, 15, 6]", "15"],
      ["[-5, -2, -9]", "-2"],
    ],
  },

  {
    id: 5,
    title: "Remove Duplicates",
    difficulty: "Easy",
    topic: "Array / Set",
    time: "15 min",
    description:
      "Return a new array containing only unique values while preserving their original order.",
    javascript: `function removeDuplicates(nums) {
  const seen = new Set();
  const result = [];

  for (const num of nums) {
    if (!seen.has(num)) {
      seen.add(num);
      result.push(num);
    }
  }

  return result;
}

console.log(removeDuplicates([1, 2, 2, 3, 1, 4]));
// [1, 2, 3, 4]`,
    python: `def remove_duplicates(nums):
    seen = set()
    result = []

    for num in nums:
        if num not in seen:
            seen.add(num)
            result.append(num)

    return result

print(remove_duplicates([1, 2, 2, 3, 1, 4]))
# [1, 2, 3, 4]`,
    testCases: [
      ["[1, 2, 2, 3, 1, 4]", "[1, 2, 3, 4]"],
      ["[5, 5, 5]", "[5]"],
    ],
  },

  {
    id: 6,
    title: "Count Character Frequency",
    difficulty: "Easy",
    topic: "String / HashMap",
    time: "15 min",
    description:
      "Create a function that counts how many times every character appears in a string.",
    javascript: `function charFrequency(str) {
  const frequency = {};

  for (const char of str) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  return frequency;
}

console.log(charFrequency("banana"));
// { b: 1, a: 3, n: 2 }`,
    python: `def char_frequency(string):
    frequency = {}

    for char in string:
        frequency[char] = frequency.get(char, 0) + 1

    return frequency

print(char_frequency("banana"))
# {'b': 1, 'a': 3, 'n': 2}`,
    testCases: [
      ['"banana"', "{ b: 1, a: 3, n: 2 }"],
      ['"hello"', "{ h: 1, e: 1, l: 2, o: 1 }"],
    ],
  },

  {
    id: 7,
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "String / HashMap",
    time: "15 min",
    description:
      "Determine whether two strings contain exactly the same characters with the same frequencies.",
    javascript: `function isAnagram(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }

  const map = new Map();

  for (const char of str1) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  for (const char of str2) {
    if (!map.has(char)) {
      return false;
    }

    map.set(char, map.get(char) - 1);

    if (map.get(char) === 0) {
      map.delete(char);
    }
  }

  return map.size === 0;
}

console.log(isAnagram("listen", "silent"));
// true`,
    python: `def is_anagram(str1, str2):
    if len(str1) != len(str2):
        return False

    frequency = {}

    for char in str1:
        frequency[char] = frequency.get(char, 0) + 1

    for char in str2:
        if char not in frequency:
            return False

        frequency[char] -= 1

        if frequency[char] == 0:
            del frequency[char]

    return len(frequency) == 0

print(is_anagram("listen", "silent"))
# True`,
    testCases: [
      ['"listen", "silent"', "true"],
      ['"hello", "world"', "false"],
    ],
  },

  {
    id: 8,
    title: "Move Zeroes",
    difficulty: "Easy",
    topic: "Array / Two Pointers",
    time: "15 min",
    description:
      "Move all zeroes to the end of an array while keeping the relative order of non-zero elements.",
    javascript: `function moveZeroes(nums) {
  let insertPosition = 0;

  for (const num of nums) {
    if (num !== 0) {
      nums[insertPosition] = num;
      insertPosition++;
    }
  }

  while (insertPosition < nums.length) {
    nums[insertPosition] = 0;
    insertPosition++;
  }

  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));
// [1, 3, 12, 0, 0]`,
    python: `def move_zeroes(nums):
    insert_position = 0

    for num in nums:
        if num != 0:
            nums[insert_position] = num
            insert_position += 1

    while insert_position < len(nums):
        nums[insert_position] = 0
        insert_position += 1

    return nums

print(move_zeroes([0, 1, 0, 3, 12]))
# [1, 3, 12, 0, 0]`,
    testCases: [
      ["[0, 1, 0, 3, 12]", "[1, 3, 12, 0, 0]"],
      ["[0, 0, 1]", "[1, 0, 0]"],
    ],
  },

  {
    id: 9,
    title: "Binary Search",
    difficulty: "Medium",
    topic: "Binary Search",
    time: "20 min",
    description:
      "Given a sorted array, find the index of a target value using binary search.",
    javascript: `function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9], 7));
// 3`,
    python: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

print(binary_search([1, 3, 5, 7, 9], 7))
# 3`,
    testCases: [
      ["[1, 3, 5, 7, 9], 7", "3"],
      ["[1, 3, 5, 7, 9], 4", "-1"],
    ],
  },

  {
    id: 10,
    title: "Maximum Subarray Sum",
    difficulty: "Medium",
    topic: "Array / Kadane's Algorithm",
    time: "20 min",
    description:
      "Find the contiguous subarray with the largest sum and return its sum.",
    javascript: `function maxSubArray(nums) {
  let current = nums[0];
  let maximum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    maximum = Math.max(maximum, current);
  }

  return maximum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1]));
// 6`,
    python: `def max_sub_array(nums):
    current = nums[0]
    maximum = nums[0]

    for i in range(1, len(nums)):
        current = max(nums[i], current + nums[i])
        maximum = max(maximum, current)

    return maximum

print(max_sub_array([-2, 1, -3, 4, -1, 2, 1]))
# 6`,
    testCases: [
      ["[-2, 1, -3, 4, -1, 2, 1]", "6"],
      ["[-5, -2, -8]", "-2"],
    ],
  },

  {
    id: 11,
    title: "Valid Parentheses",
    difficulty: "Medium",
    topic: "Stack",
    time: "20 min",
    description:
      "Check whether a string containing (), {}, and [] has valid and correctly nested brackets.",
    javascript: `function isValidParentheses(str) {
  const stack = [];
  const pairs = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (const char of str) {
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

console.log(isValidParentheses("({[]})"));
// true`,
    python: `def is_valid_parentheses(string):
    stack = []
    pairs = {
        ")": "(",
        "}": "{",
        "]": "["
    }

    for char in string:
        if char in "({[":
            stack.append(char)
        else:
            if not stack or stack.pop() != pairs[char]:
                return False

    return len(stack) == 0

print(is_valid_parentheses("({[]})"))
# True`,
    testCases: [
      ['"({[]})"', "true"],
      ['"([)]"', "false"],
    ],
  },

  {
    id: 12,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    time: "25 min",
    description:
      "Find the length of the longest substring that contains no repeated characters.",
    javascript: `function longestUniqueSubstring(str) {
  const set = new Set();
  let left = 0;
  let maximum = 0;

  for (let right = 0; right < str.length; right++) {
    while (set.has(str[right])) {
      set.delete(str[left]);
      left++;
    }

    set.add(str[right]);

    maximum = Math.max(
      maximum,
      right - left + 1
    );
  }

  return maximum;
}

console.log(longestUniqueSubstring("abcabcbb"));
// 3`,
    python: `def longest_unique_substring(string):
    seen = set()
    left = 0
    maximum = 0

    for right in range(len(string)):
        while string[right] in seen:
            seen.remove(string[left])
            left += 1

        seen.add(string[right])

        maximum = max(
            maximum,
            right - left + 1
        )

    return maximum

print(longest_unique_substring("abcabcbb"))
# 3`,
    testCases: [
      ['"abcabcbb"', "3"],
      ['"bbbbb"', "1"],
    ],
  },

  {
    id: 13,
    title: "Merge Two Sorted Arrays",
    difficulty: "Medium",
    topic: "Array / Two Pointers",
    time: "20 min",
    description:
      "Merge two sorted arrays into one sorted array without using a built-in sorting function.",
    javascript: `function mergeSortedArrays(arr1, arr2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

console.log(
  mergeSortedArrays([1, 3, 5], [2, 4, 6])
);
// [1, 2, 3, 4, 5, 6]`,
    python: `def merge_sorted_arrays(arr1, arr2):
    result = []
    i = 0
    j = 0

    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1

    while i < len(arr1):
        result.append(arr1[i])
        i += 1

    while j < len(arr2):
        result.append(arr2[j])
        j += 1

    return result

print(
    merge_sorted_arrays([1, 3, 5], [2, 4, 6])
)
# [1, 2, 3, 4, 5, 6]`,
    testCases: [
      ["[1, 3, 5], [2, 4, 6]", "[1, 2, 3, 4, 5, 6]"],
      ["[1, 2], [3, 4]", "[1, 2, 3, 4]"],
    ],
  },

  {
    id: 14,
    title: "First Non-Repeating Character",
    difficulty: "Medium",
    topic: "String / HashMap",
    time: "20 min",
    description:
      "Return the first character in a string that does not repeat. Return -1 if every character repeats.",
    javascript: `function firstUniqueCharacter(str) {
  const frequency = {};

  for (const char of str) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  for (let i = 0; i < str.length; i++) {
    if (frequency[str[i]] === 1) {
      return i;
    }
  }

  return -1;
}

console.log(firstUniqueCharacter("leetcode"));
// 0`,
    python: `def first_unique_character(string):
    frequency = {}

    for char in string:
        frequency[char] = frequency.get(char, 0) + 1

    for i in range(len(string)):
        if frequency[string[i]] == 1:
            return i

    return -1

print(first_unique_character("leetcode"))
# 0`,
    testCases: [
      ['"leetcode"', "0"],
      ['"aabb"', "-1"],
    ],
  },

  {
    id: 15,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Array / Prefix Product",
    time: "25 min",
    description:
      "Return an array where each element is the product of all elements except the element at that index.",
    javascript: `function productExceptSelf(nums) {
  const result = new Array(nums.length).fill(1);

  let prefix = 1;

  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;

  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}

console.log(productExceptSelf([1, 2, 3, 4]));
// [24, 12, 8, 6]`,
    python: `def product_except_self(nums):
    result = [1] * len(nums)

    prefix = 1

    for i in range(len(nums)):
        result[i] = prefix
        prefix *= nums[i]

    suffix = 1

    for i in range(len(nums) - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]

    return result

print(product_except_self([1, 2, 3, 4]))
# [24, 12, 8, 6]`,
    testCases: [
      ["[1, 2, 3, 4]", "[24, 12, 8, 6]"],
      ["[-1, 1, 0, -3, 3]", "[0, 0, -9, 0, 0]"],
    ],
  },

  {
    id: 16,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Medium",
    topic: "Array / Greedy",
    time: "20 min",
    description:
      "Given daily stock prices, find the maximum profit you can make by buying once and selling once.",
    javascript: `function maxProfit(prices) {
  let minimumPrice = prices[0];
  let maximumProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    minimumPrice = Math.min(
      minimumPrice,
      prices[i]
    );

    maximumProfit = Math.max(
      maximumProfit,
      prices[i] - minimumPrice
    );
  }

  return maximumProfit;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));
// 5`,
    python: `def max_profit(prices):
    minimum_price = prices[0]
    maximum_profit = 0

    for i in range(1, len(prices)):
        minimum_price = min(
            minimum_price,
            prices[i]
        )

        maximum_profit = max(
            maximum_profit,
            prices[i] - minimum_price
        )

    return maximum_profit

print(max_profit([7, 1, 5, 3, 6, 4]))
# 5`,
    testCases: [
      ["[7, 1, 5, 3, 6, 4]", "5"],
      ["[7, 6, 4, 3, 1]", "0"],
    ],
  },

  {
    id: 17,
    title: "Climbing Stairs",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    time: "20 min",
    description:
      "You can climb either one or two steps at a time. Return the number of distinct ways to reach the top.",
    javascript: `function climbStairs(n) {
  if (n <= 2) {
    return n;
  }

  let one = 1;
  let two = 2;

  for (let i = 3; i <= n; i++) {
    const current = one + two;
    one = two;
    two = current;
  }

  return two;
}

console.log(climbStairs(5));
// 8`,
    python: `def climb_stairs(n):
    if n <= 2:
        return n

    one = 1
    two = 2

    for i in range(3, n + 1):
        current = one + two
        one = two
        two = current

    return two

print(climb_stairs(5))
# 8`,
    testCases: [
      ["5", "8"],
      ["3", "3"],
    ],
  },

  {
    id: 18,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Medium",
    topic: "Binary Tree / Recursion",
    time: "25 min",
    description:
      "Given the root of a binary tree, return its maximum depth.",
    javascript: `function maxDepth(root) {
  if (root === null) {
    return 0;
  }

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return 1 + Math.max(
    leftDepth,
    rightDepth
  );
}

// Example tree:
//       3
//      / \\
//     9  20
//        / \\
//       15  7

console.log(maxDepth(root));
// 3`,
    python: `def max_depth(root):
    if root is None:
        return 0

    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)

    return 1 + max(
        left_depth,
        right_depth
    )

# Example tree:
#       3
#      / \\
#     9  20
#        / \\
#       15  7

print(max_depth(root))
# 3`,
    testCases: [
      ["[3, 9, 20, null, null, 15, 7]", "3"],
      ["[1, null, 2]", "2"],
    ],
  },

  {
    id: 19,
    title: "Number of Islands",
    difficulty: "Hard",
    topic: "Graph / DFS",
    time: "30 min",
    description:
      "Given a 2D grid containing land and water, count the number of connected islands.",
    javascript: `function numIslands(grid) {
  if (!grid.length) return 0;

  let count = 0;

  function dfs(row, col) {
    if (
      row < 0 ||
      col < 0 ||
      row >= grid.length ||
      col >= grid[0].length ||
      grid[row][col] !== "1"
    ) {
      return;
    }

    grid[row][col] = "0";

    dfs(row + 1, col);
    dfs(row - 1, col);
    dfs(row, col + 1);
    dfs(row, col - 1);
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "1") {
        count++;
        dfs(row, col);
      }
    }
  }

  return count;
}

const grid = [
  ["1", "1", "0", "0"],
  ["1", "0", "0", "1"],
  ["0", "0", "1", "1"],
];

console.log(numIslands(grid));
// 2`,
    python: `def num_islands(grid):
    if not grid:
        return 0

    rows = len(grid)
    cols = len(grid[0])
    count = 0

    def dfs(row, col):
        if (
            row < 0 or
            col < 0 or
            row >= rows or
            col >= cols or
            grid[row][col] != "1"
        ):
            return

        grid[row][col] = "0"

        dfs(row + 1, col)
        dfs(row - 1, col)
        dfs(row, col + 1)
        dfs(row, col - 1)

    for row in range(rows):
        for col in range(cols):
            if grid[row][col] == "1":
                count += 1
                dfs(row, col)

    return count

grid = [
    ["1", "1", "0", "0"],
    ["1", "0", "0", "1"],
    ["0", "0", "1", "1"],
]

print(num_islands(grid))
# 2`,
    testCases: [
      ['[["1","1","0"],["1","0","0"],["0","0","1"]]', "2"],
      ['[["1","1"],["1","1"]]', "1"],
    ],
  },

  {
    id: 20,
    title: "LRU Cache",
    difficulty: "Hard",
    topic: "HashMap / Linked List",
    time: "35 min",
    description:
      "Design an LRU Cache supporting get and put operations in O(1) time.",
    javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    const value = this.cache.get(key);

    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}

const cache = new LRUCache(2);

cache.put(1, 10);
cache.put(2, 20);

console.log(cache.get(1));
// 10

cache.put(3, 30);

console.log(cache.get(2));
// -1`,
    python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1

        value = self.cache.pop(key)
        self.cache[key] = value

        return value

    def put(self, key, value):
        if key in self.cache:
            self.cache.pop(key)

        self.cache[key] = value

        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

cache = LRUCache(2)

cache.put(1, 10)
cache.put(2, 20)

print(cache.get(1))
# 10

cache.put(3, 30)

print(cache.get(2))
# -1`,
    testCases: [
      ["capacity=2, put(1,10), put(2,20), get(1)", "10"],
      ["after put(3,30), get(2)", "-1"],
    ],
  },
];

const moreQuestions = [
  {
    id: 21,
    title: "3Sum",
    difficulty: "Medium",
    topic: "Array / Two Pointers",
    time: "25 min",
    description:
      "Find all unique triplets in an array whose sum is equal to zero.",
    javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);

  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        while (
          left < right &&
          nums[left] === nums[left + 1]
        ) {
          left++;
        }

        while (
          left < right &&
          nums[right] === nums[right - 1]
        ) {
          right--;
        }

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]));
// [[-1, -1, 2], [-1, 0, 1]]`,
    python: `def three_sum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left = i + 1
        right = len(nums) - 1

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total == 0:
                result.append([
                    nums[i],
                    nums[left],
                    nums[right]
                ])

                while (
                    left < right and
                    nums[left] == nums[left + 1]
                ):
                    left += 1

                while (
                    left < right and
                    nums[right] == nums[right - 1]
                ):
                    right -= 1

                left += 1
                right -= 1

            elif total < 0:
                left += 1
            else:
                right -= 1

    return result

print(three_sum([-1, 0, 1, 2, -1, -4]))
# [[-1, -1, 2], [-1, 0, 1]]`,
    testCases: [
      ["[-1,0,1,2,-1,-4]", "[[-1,-1,2],[-1,0,1]]"],
    ],
  },

  {
    id: 22,
    title: "Merge Intervals",
    difficulty: "Medium",
    topic: "Array / Sorting",
    time: "25 min",
    description:
      "Merge all overlapping intervals and return the non-overlapping intervals.",
    javascript: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [];

  for (const interval of intervals) {
    if (
      result.length === 0 ||
      result[result.length - 1][1] < interval[0]
    ) {
      result.push(interval);
    } else {
      result[result.length - 1][1] =
        Math.max(
          result[result.length - 1][1],
          interval[1]
        );
    }
  }

  return result;
}

console.log(
  mergeIntervals([[1,3], [2,6], [8,10], [15,18]])
);
// [[1,6], [8,10], [15,18]]`,
    python: `def merge_intervals(intervals):
    intervals.sort()
    result = []

    for start, end in intervals:
        if not result or result[-1][1] < start:
            result.append([start, end])
        else:
            result[-1][1] = max(
                result[-1][1],
                end
            )

    return result

print(
    merge_intervals([[1,3], [2,6], [8,10], [15,18]])
)
# [[1,6], [8,10], [15,18]]`,
    testCases: [
      ["[[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]"],
    ],
  },

  {
    id: 23,
    title: "Rotate Array",
    difficulty: "Medium",
    topic: "Array",
    time: "20 min",
    description:
      "Rotate an array to the right by k positions using an efficient in-place approach.",
    javascript: `function rotateArray(nums, k) {
  k = k % nums.length;

  nums.reverse();

  reversePart(nums, 0, k - 1);
  reversePart(nums, k, nums.length - 1);

  return nums;
}

function reversePart(nums, left, right) {
  while (left < right) {
    [nums[left], nums[right]] =
      [nums[right], nums[left]];

    left++;
    right--;
  }
}

console.log(rotateArray([1,2,3,4,5,6,7], 3));
// [5,6,7,1,2,3,4]`,
    python: `def rotate_array(nums, k):
    k %= len(nums)

    nums.reverse()

    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])

    return nums

print(rotate_array([1,2,3,4,5,6,7], 3))
# [5,6,7,1,2,3,4]`,
    testCases: [
      ["[1,2,3,4,5,6,7], 3", "[5,6,7,1,2,3,4]"],
      ["[1,2,3], 1", "[3,1,2]"],
    ],
  },

  {
    id: 24,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    topic: "String",
    time: "15 min",
    description:
      "Find the longest common prefix shared by all strings in an array.",
    javascript: `function longestCommonPrefix(words) {
  if (!words.length) return "";

  let prefix = words[0];

  for (let i = 1; i < words.length; i++) {
    while (!words[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);

      if (!prefix) return "";
    }
  }

  return prefix;
}

console.log(
  longestCommonPrefix(["flower", "flow", "flight"])
);
// "fl"`,
    python: `def longest_common_prefix(words):
    if not words:
        return ""

    prefix = words[0]

    for word in words[1:]:
        while not word.startswith(prefix):
            prefix = prefix[:-1]

            if not prefix:
                return ""

    return prefix

print(
    longest_common_prefix(
        ["flower", "flow", "flight"]
    )
)
# "fl"`,
    testCases: [
      ['["flower","flow","flight"]', '"fl"'],
      ['["dog","racecar","car"]', '""'],
    ],
  },

  {
    id: 25,
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "String / HashMap",
    time: "25 min",
    description:
      "Group strings that are anagrams of each other.",
    javascript: `function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const key = word
      .split("")
      .sort()
      .join("");

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(word);
  }

  return Array.from(groups.values());
}

console.log(
  groupAnagrams([
    "eat",
    "tea",
    "tan",
    "ate",
    "nat",
    "bat"
  ])
);`,
    python: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)

    for word in words:
        key = "".join(sorted(word))
        groups[key].append(word)

    return list(groups.values())

print(
    group_anagrams([
        "eat",
        "tea",
        "tan",
        "ate",
        "nat",
        "bat"
    ])
)`,
    testCases: [
      ['["eat","tea","tan","ate","nat","bat"]', "Grouped anagrams"],
    ],
  },

  {
    id: 26,
    title: "Min Stack",
    difficulty: "Medium",
    topic: "Stack",
    time: "25 min",
    description:
      "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).",
    javascript: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(value) {
    this.stack.push(value);

    const minimum =
      this.minStack.length === 0
        ? value
        : Math.min(
            value,
            this.minStack[this.minStack.length - 1]
          );

    this.minStack.push(minimum);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

const stack = new MinStack();

stack.push(-2);
stack.push(0);
stack.push(-3);

console.log(stack.getMin());
// -3`,
    python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, value):
        self.stack.append(value)

        if not self.min_stack:
            self.min_stack.append(value)
        else:
            self.min_stack.append(
                min(value, self.min_stack[-1])
            )

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def get_min(self):
        return self.min_stack[-1]

stack = MinStack()

stack.push(-2)
stack.push(0)
stack.push(-3)

print(stack.get_min())
# -3`,
    testCases: [
      ["push(-2), push(0), push(-3)", "-3"],
    ],
  },

  {
    id: 27,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Binary Tree / BFS",
    time: "25 min",
    description:
      "Return the values of a binary tree level by level from left to right.",
    javascript: `function levelOrder(root) {
  if (!root) return [];

  const queue = [root];
  const result = [];

  while (queue.length) {
    const level = [];
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      level.push(node.value);

      if (node.left) {
        queue.push(node.left);
      }

      if (node.right) {
        queue.push(node.right);
      }
    }

    result.push(level);
  }

  return result;
}

// Example:
//       3
//      / \\
//     9  20
//        / \\
//       15  7

console.log(levelOrder(root));
// [[3], [9,20], [15,7]]`,
    python: `from collections import deque

def level_order(root):
    if not root:
        return []

    queue = deque([root])
    result = []

    while queue:
        level = []

        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.value)

            if node.left:
                queue.append(node.left)

            if node.right:
                queue.append(node.right)

        result.append(level)

    return result

# [[3], [9,20], [15,7]]`,
    testCases: [
      ["[3,9,20,null,null,15,7]", "[[3],[9,20],[15,7]]"],
    ],
  },

  {
    id: 28,
    title: "Climbing Stairs Optimized",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    time: "20 min",
    description:
      "Solve the climbing stairs problem using O(1) extra space.",
    javascript: `function climbStairsOptimized(n) {
  let previous = 1;
  let current = 1;

  for (let i = 2; i <= n; i++) {
    const next = previous + current;

    previous = current;
    current = next;
  }

  return current;
}

console.log(climbStairsOptimized(6));
// 13`,
    python: `def climb_stairs_optimized(n):
    previous = 1
    current = 1

    for i in range(2, n + 1):
        next_value = previous + current

        previous = current
        current = next_value

    return current

print(climb_stairs_optimized(6))
# 13`,
    testCases: [
      ["6", "13"],
      ["4", "5"],
    ],
  },

  {
    id: 29,
    title: "House Robber",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    time: "25 min",
    description:
      "Given houses with money, determine the maximum amount you can rob without robbing two adjacent houses.",
    javascript: `function rob(nums) {
  let previousTwo = 0;
  let previousOne = 0;

  for (const money of nums) {
    const current = Math.max(
      previousOne,
      previousTwo + money
    );

    previousTwo = previousOne;
    previousOne = current;
  }

  return previousOne;
}

console.log(rob([2, 7, 9, 3, 1]));
// 12`,
    python: `def rob(nums):
    previous_two = 0
    previous_one = 0

    for money in nums:
        current = max(
            previous_one,
            previous_two + money
        )

        previous_two = previous_one
        previous_one = current

    return previous_one

print(rob([2, 7, 9, 3, 1]))
# 12`,
    testCases: [
      ["[2,7,9,3,1]", "12"],
      ["[1,2,3,1]", "4"],
    ],
  },

  {
    id: 30,
    title: "Coin Change",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    time: "30 min",
    description:
      "Given coin denominations and an amount, return the minimum number of coins required to make that amount.",
    javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1)
    .fill(Infinity);

  dp[0] = 0;

  for (let current = 1; current <= amount; current++) {
    for (const coin of coins) {
      if (coin <= current) {
        dp[current] = Math.min(
          dp[current],
          dp[current - coin] + 1
        );
      }
    }
  }

  return dp[amount] === Infinity
    ? -1
    : dp[amount];
}

console.log(coinChange([1, 2, 5], 11));
// 3`,
    python: `def coin_change(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0

    for current in range(1, amount + 1):
        for coin in coins:
            if coin <= current:
                dp[current] = min(
                    dp[current],
                    dp[current - coin] + 1
                )

    return (
        -1
        if dp[amount] == float("inf")
        else dp[amount]
    )

print(coin_change([1, 2, 5], 11))
# 3`,
    testCases: [
      ["[1,2,5], 11", "3"],
      ["[2], 3", "-1"],
    ],
  },

  {
    id: 31,
    title: "Longest Palindromic Substring",
    difficulty: "Hard",
    topic: "String / Dynamic Programming",
    time: "30 min",
    description:
      "Find the longest substring that reads the same forward and backward.",
    javascript: `function longestPalindrome(str) {
  let start = 0;
  let end = 0;

  function expand(left, right) {
    while (
      left >= 0 &&
      right < str.length &&
      str[left] === str[right]
    ) {
      left--;
      right++;
    }

    return right - left - 1;
  }

  for (let i = 0; i < str.length; i++) {
    const odd = expand(i, i);
    const even = expand(i, i + 1);

    const length = Math.max(odd, even);

    if (length > end - start) {
      start = i - Math.floor((length - 1) / 2);
      end = i + Math.floor(length / 2);
    }
  }

  return str.slice(start, end + 1);
}

console.log(longestPalindrome("babad"));
// "bab" or "aba"`,
    python: `def longest_palindrome(string):
    start = 0
    end = 0

    def expand(left, right):
        while (
            left >= 0 and
            right < len(string) and
            string[left] == string[right]
        ):
            left -= 1
            right += 1

        return right - left - 1

    for i in range(len(string)):
        odd = expand(i, i)
        even = expand(i, i + 1)

        length = max(odd, even)

        if length > end - start:
            start = i - (length - 1) // 2
            end = i + length // 2

    return string[start:end + 1]

print(longest_palindrome("babad"))
# "bab" or "aba"`,
    testCases: [
      ['"babad"', '"bab" or "aba"'],
      ['"cbbd"', '"bb"'],
    ],
  },

  {
    id: 32,
    title: "Subarray Sum Equals K",
    difficulty: "Hard",
    topic: "Array / Prefix Sum",
    time: "30 min",
    description:
      "Count the number of continuous subarrays whose sum equals k.",
    javascript: `function subarraySum(nums, k) {
  const frequency = new Map();
  frequency.set(0, 1);

  let prefixSum = 0;
  let count = 0;

  for (const num of nums) {
    prefixSum += num;

    if (frequency.has(prefixSum - k)) {
      count += frequency.get(prefixSum - k);
    }

    frequency.set(
      prefixSum,
      (frequency.get(prefixSum) || 0) + 1
    );
  }

  return count;
}

console.log(subarraySum([1, 1, 1], 2));
// 2`,
    python: `def subarray_sum(nums, k):
    frequency = {0: 1}

    prefix_sum = 0
    count = 0

    for num in nums:
        prefix_sum += num

        count += frequency.get(
            prefix_sum - k,
            0
        )

        frequency[prefix_sum] = (
            frequency.get(prefix_sum, 0) + 1
        )

    return count

print(subarray_sum([1, 1, 1], 2))
# 2`,
    testCases: [
      ["[1,1,1], 2", "2"],
      ["[1,2,3], 3", "2"],
    ],
  },

  {
    id: 33,
    title: "Word Break",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    time: "30 min",
    description:
      "Determine whether a string can be segmented into a sequence of one or more dictionary words.",
    javascript: `function wordBreak(str, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(str.length + 1)
    .fill(false);

  dp[0] = true;

  for (let i = 1; i <= str.length; i++) {
    for (let j = 0; j < i; j++) {
      if (
        dp[j] &&
        words.has(str.slice(j, i))
      ) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[str.length];
}

console.log(
  wordBreak(
    "leetcode",
    ["leet", "code"]
  )
);
// true`,
    python: `def word_break(string, word_dict):
    words = set(word_dict)

    dp = [False] * (len(string) + 1)
    dp[0] = True

    for i in range(1, len(string) + 1):
        for j in range(i):
            if (
                dp[j] and
                string[j:i] in words
            ):
                dp[i] = True
                break

    return dp[len(string)]

print(
    word_break(
        "leetcode",
        ["leet", "code"]
    )
)
# True`,
    testCases: [
      ['"leetcode", ["leet","code"]', "true"],
      ['"applepenapple", ["apple","pen"]', "true"],
    ],
  },

  {
    id: 34,
    title: "Kth Largest Element",
    difficulty: "Medium",
    topic: "Array / Heap",
    time: "25 min",
    description:
      "Find the kth largest element in an unsorted array.",
    javascript: `function kthLargest(nums, k) {
  nums.sort((a, b) => b - a);

  return nums[k - 1];
}

console.log(
  kthLargest([3, 2, 1, 5, 6, 4], 2)
);
// 5`,
    python: `def kth_largest(nums, k):
    nums.sort(reverse=True)

    return nums[k - 1]

print(
    kth_largest([3, 2, 1, 5, 6, 4], 2)
)
# 5`,
    testCases: [
      ["[3,2,1,5,6,4], 2", "5"],
      ["[3,2,3,1,2,4,5,5,6], 4", "4"],
    ],
  },

  {
    id: 35,
    title: "Reverse Linked List",
    difficulty: "Medium",
    topic: "Linked List",
    time: "20 min",
    description:
      "Reverse a singly linked list and return the new head.",
    javascript: `function reverseLinkedList(head) {
  let previous = null;
  let current = head;

  while (current !== null) {
    const next = current.next;

    current.next = previous;
    previous = current;
    current = next;
  }

  return previous;
}

// 1 -> 2 -> 3 -> null
// becomes
// 3 -> 2 -> 1 -> null

console.log(reverseLinkedList(head));`,
    python: `def reverse_linked_list(head):
    previous = None
    current = head

    while current is not None:
        next_node = current.next

        current.next = previous
        previous = current
        current = next_node

    return previous

# 1 -> 2 -> 3 -> None
# becomes
# 3 -> 2 -> 1 -> None`,
    testCases: [
      ["[1,2,3,4,5]", "[5,4,3,2,1]"],
      ["[1,2]", "[2,1]"],
    ],
  },

  {
    id: 36,
    title: "Detect Cycle in Linked List",
    difficulty: "Medium",
    topic: "Linked List / Two Pointers",
    time: "20 min",
    description:
      "Determine whether a linked list contains a cycle using O(1) extra space.",
    javascript: `function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}

console.log(hasCycle(head));
// true or false`,
    python: `def has_cycle(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False

print(has_cycle(head))
# True or False`,
    testCases: [
      ["[3,2,0,-4], cycle at index 1", "true"],
      ["[1,2], no cycle", "false"],
    ],
  },

  {
    id: 37,
    title: "Number of 1 Bits",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    time: "15 min",
    description:
      "Count the number of 1 bits in the binary representation of an integer.",
    javascript: `function countBits(n) {
  let count = 0;

  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }

  return count;
}

console.log(countBits(11));
// 3
// Binary: 1011`,
    python: `def count_bits(n):
    count = 0

    while n != 0:
        n = n & (n - 1)
        count += 1

    return count

print(count_bits(11))
# 3
# Binary: 1011`,
    testCases: [
      ["11", "3"],
      ["7", "3"],
    ],
  },

  {
    id: 38,
    title: "Power of Number",
    difficulty: "Medium",
    topic: "Recursion / Math",
    time: "20 min",
    description:
      "Implement a power function that calculates x raised to the power n efficiently.",
    javascript: `function power(x, n) {
  if (n === 0) {
    return 1;
  }

  if (n < 0) {
    return 1 / power(x, -n);
  }

  const half = power(x, Math.floor(n / 2));

  if (n % 2 === 0) {
    return half * half;
  }

  return x * half * half;
}

console.log(power(2, 10));
// 1024`,
    python: `def power(x, n):
    if n == 0:
        return 1

    if n < 0:
        return 1 / power(x, -n)

    half = power(x, n // 2)

    if n % 2 == 0:
        return half * half

    return x * half * half

print(power(2, 10))
# 1024`,
    testCases: [
      ["2, 10", "1024"],
      ["3, 3", "27"],
    ],
  },

  {
    id: 39,
    title: "Permutations",
    difficulty: "Hard",
    topic: "Backtracking",
    time: "30 min",
    description:
      "Generate all possible permutations of an array containing unique numbers.",
    javascript: `function permutations(nums) {
  const result = [];

  function backtrack(path, used) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      path.push(nums[i]);

      backtrack(path, used);

      path.pop();
      used[i] = false;
    }
  }

  backtrack([], []);

  return result;
}

console.log(permutations([1, 2, 3]));
// 6 permutations`,
    python: `def permutations(nums):
    result = []

    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return

        for i in range(len(nums)):
            if used[i]:
                continue

            used[i] = True
            path.append(nums[i])

            backtrack(path, used)

            path.pop()
            used[i] = False

    backtrack([], [False] * len(nums))

    return result

print(permutations([1, 2, 3]))
# 6 permutations`,
    testCases: [
      ["[1,2,3]", "6 permutations"],
      ["[1,2]", "[[1,2],[2,1]]"],
    ],
  },

  {
    id: 40,
    title: "Word Ladder",
    difficulty: "Hard",
    topic: "Graph / BFS",
    time: "35 min",
    description:
      "Transform one word into another by changing one character at a time. Every intermediate word must exist in the dictionary.",
    javascript: `function wordLadder(beginWord, endWord, wordList) {
  const words = new Set(wordList);

  if (!words.has(endWord)) {
    return 0;
  }

  const queue = [[beginWord, 1]];

  while (queue.length) {
    const [word, steps] = queue.shift();

    if (word === endWord) {
      return steps;
    }

    for (let i = 0; i < word.length; i++) {
      for (let charCode = 97; charCode <= 122; charCode++) {
        const char = String.fromCharCode(charCode);

        const nextWord =
          word.slice(0, i) +
          char +
          word.slice(i + 1);

        if (words.has(nextWord)) {
          words.delete(nextWord);
          queue.push([
            nextWord,
            steps + 1
          ]);
        }
      }
    }
  }

  return 0;
}

console.log(
  wordLadder(
    "hit",
    "cog",
    ["hot","dot","dog","lot","log","cog"]
  )
);
// 5`,
    python: `from collections import deque

def word_ladder(begin_word, end_word, word_list):
    words = set(word_list)

    if end_word not in words:
        return 0

    queue = deque([(begin_word, 1)])

    while queue:
        word, steps = queue.popleft()

        if word == end_word:
            return steps

        for i in range(len(word)):
            for code in range(ord("a"), ord("z") + 1):
                char = chr(code)

                next_word = (
                    word[:i] +
                    char +
                    word[i + 1:]
                )

                if next_word in words:
                    words.remove(next_word)

                    queue.append(
                        (next_word, steps + 1)
                    )

    return 0

print(
    word_ladder(
        "hit",
        "cog",
        ["hot","dot","dog","lot","log","cog"]
    )
)
# 5`,
    testCases: [
      [
        '"hit", "cog", ["hot","dot","dog","lot","log","cog"]',
        "5",
      ],
      [
        '"hit", "cog", ["hot","dot","dog","lot","log"]',
        "0",
      ],
    ],
  },
];

const skills = [
  "Arrays",
  "Strings",
  "HashMap",
  "Sets",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Stack",
  "Queue",
  "Linked List",
  "Binary Trees",
  "Graphs",
  "BFS",
  "DFS",
  "Dynamic Programming",
  "Backtracking",
  "Greedy",
  "Bit Manipulation",
];

export default function InterviewPractice() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark =
    theme === "dark" ||
    (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  const [allQuestions, setAllQuestions] = useState(firstQuestions);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [batchNumber, setBatchNumber] = useState(1);
  const [language, setLanguage] = useState("javascript");

  const question = allQuestions[current];

  const progress = useMemo(() => {
    if (!allQuestions.length) return 0;

    return Math.round(
      ((current + 1) / allQuestions.length) * 100
    );
  }, [current, allQuestions.length]);

  const isCurrentCompleted = completed.includes(question.id);

  const isBatchComplete =
    current === allQuestions.length - 1 &&
    isCurrentCompleted;

  const markCompleted = () => {
    setCompleted((prev) =>
      prev.includes(question.id)
        ? prev
        : [...prev, question.id]
    );
  };

  const nextQuestion = () => {
    markCompleted();

    if (current < allQuestions.length - 1) {
      setCurrent((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrent(index);
    setShowAnswer(false);
  };

  const loadMoreQuestions = () => {
    if (allQuestions.length >= 40) return;

    setAllQuestions((prev) => [
      ...prev,
      ...moreQuestions,
    ]);

    setBatchNumber((prev) => prev + 1);

    setCurrent(20);
    setShowAnswer(false);
    setLanguage("javascript");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetPractice = () => {
    setCurrent(0);
    setShowAnswer(false);
    setCompleted([]);
    setAllQuestions(firstQuestions);
    setBatchNumber(1);
    setLanguage("javascript");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const bg = isDark
    ? "bg-[#09090b] text-white"
    : "bg-slate-50 text-slate-900";

  const card = isDark
    ? "border-white/10 bg-white/[0.035]"
    : "border-slate-200 bg-white";

  const muted = isDark
    ? "text-zinc-400"
    : "text-slate-500";

  const border = isDark
    ? "border-white/10"
    : "border-slate-200";

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 border-b ${border} ${
          isDark
            ? "bg-[#09090b]/90"
            : "bg-white/90"
        } backdrop-blur-xl`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className={`group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              isDark
                ? "border-white/10 bg-white/5 hover:bg-white/10"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <FaArrowLeft className="transition group-hover:-translate-x-1" />
            Back to Home
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <FaCode />
            </div>

            <div>
              <p className="text-sm font-bold">
                Interview Practice
              </p>
              <p className={`text-xs ${muted}`}>
                Coding Challenge
              </p>
            </div>
          </div>

          <div
            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
              isDark
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            BATCH {batchNumber}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 via-indigo-600/10 to-transparent p-6 sm:p-8 lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wider text-red-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                REAL CODING INTERVIEW PRACTICE
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Master Coding Problems
                <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  Asked in Interviews
                </span>
              </h1>

              <p
                className={`mt-4 max-w-2xl text-sm leading-7 sm:text-base ${muted}`}
              >
                Practice real coding interview problems.
                Every challenge includes a function-based
                problem, test cases, JavaScript solution,
                and Python solution.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
                  <FaCode />
                  Coding Problems
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
                  <SiJavascript />
                  JavaScript
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                  <SiPython />
                  Python
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div
              className={`rounded-2xl border ${border} ${
                isDark
                  ? "bg-black/20"
                  : "bg-white/70"
              } p-5`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`text-sm ${muted}`}>
                  Your Progress
                </span>

                <span className="text-sm font-bold text-violet-400">
                  {progress}%
                </span>
              </div>

              <div
                className={`h-3 overflow-hidden rounded-full ${
                  isDark
                    ? "bg-white/10"
                    : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className={muted}>
                  Question {current + 1}
                </span>

                <span className={muted}>
                  {allQuestions.length} Total
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  className={`rounded-xl border ${border} p-3`}
                >
                  <p className={`text-xs ${muted}`}>
                    Completed
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {completed.length}
                  </p>
                </div>

                <div
                  className={`rounded-xl border ${border} p-3`}
                >
                  <p className={`text-xs ${muted}`}>
                    Remaining
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {Math.max(
                      allQuestions.length -
                        completed.length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <FaTerminal />
            </div>

            <div>
              <h2 className="font-bold">
                Skills You&apos;ll Practice
              </h2>
              <p className={`text-xs ${muted}`}>
                Interview-focused coding patterns
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className={`rounded-lg border ${border} px-3 py-2 text-xs font-medium ${
                  isDark
                    ? "bg-white/[0.025] text-zinc-300"
                    : "bg-white text-slate-600"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* QUESTION NAVIGATOR */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                Question Navigator
              </h2>
              <p className={`text-xs ${muted}`}>
                Jump directly to any question
              </p>
            </div>

            <span
              className={`text-xs font-semibold ${muted}`}
            >
              {completed.length}/{allQuestions.length} completed
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allQuestions.map((item, index) => {
              const isActive = index === current;
              const isDone = completed.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => jumpToQuestion(index)}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition ${
                    isActive
                      ? "border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                      : isDone
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : `${border} ${
                          isDark
                            ? "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07]"
                            : "bg-white text-slate-500 hover:bg-slate-100"
                        }`
                  }`}
                >
                  {isDone && !isActive ? (
                    <FaCheckCircle className="text-xs" />
                  ) : (
                    item.id
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* MAIN QUESTION */}
        <section className="mt-8">
          <div
            className={`overflow-hidden rounded-3xl border ${border} ${card} shadow-2xl shadow-black/5`}
          >
            {/* QUESTION HEADER */}
            <div
              className={`border-b ${border} p-5 sm:p-7`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black shadow-lg shadow-violet-500/20">
                    {question.id}
                  </div>

                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-widest ${muted}`}
                    >
                      Coding Challenge
                    </p>

                    <h2 className="mt-1 text-lg font-black sm:text-xl">
                      {question.title}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      question.difficulty === "Hard"
                        ? "bg-red-500/10 text-red-400"
                        : question.difficulty === "Medium"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {question.difficulty}
                  </span>

                  <span
                    className={`rounded-full border ${border} px-3 py-1.5 text-xs font-semibold ${muted}`}
                  >
                    {question.topic}
                  </span>

                  <span
                    className={`flex items-center gap-1.5 rounded-full border ${border} px-3 py-1.5 text-xs font-semibold ${muted}`}
                  >
                    <FaClock />
                    {question.time}
                  </span>
                </div>
              </div>
            </div>

            {/* QUESTION BODY */}
            <div className="p-5 sm:p-7 lg:p-9">
              <div className="max-w-4xl">
                <p
                  className={`text-xs font-bold uppercase tracking-widest text-violet-400`}
                >
                  Problem Statement
                </p>

                <h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  {question.title}
                </h3>

                <p
                  className={`mt-4 text-sm leading-7 sm:text-base ${muted}`}
                >
                  {question.description}
                </p>
              </div>

              {/* LANGUAGE TABS */}
              <div className="mt-8">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div
                    className={`inline-flex rounded-xl border ${border} ${
                      isDark
                        ? "bg-black/20"
                        : "bg-slate-100"
                    } p-1`}
                  >
                    <button
                      onClick={() =>
                        setLanguage("javascript")
                      }
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                        language === "javascript"
                          ? "bg-yellow-500 text-black shadow"
                          : muted
                      }`}
                    >
                      <SiJavascript />
                      JavaScript
                    </button>

                    <button
                      onClick={() => setLanguage("python")}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                        language === "python"
                          ? "bg-blue-500 text-white shadow"
                          : muted
                      }`}
                    >
                      <SiPython />
                      Python
                    </button>
                  </div>

                  <span
                    className={`text-xs font-semibold ${muted}`}
                  >
                    Starter / Solution Code
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>

                    <span className="text-xs font-medium text-zinc-500">
                      {language === "javascript"
                        ? "solution.js"
                        : "solution.py"}
                    </span>

                    <FaCode className="text-zinc-500" />
                  </div>

                  <pre className="max-h-[520px] overflow-auto p-5 text-xs leading-6 text-zinc-300 sm:text-sm">
                    <code>
                      {language === "javascript"
                        ? question.javascript
                        : question.python}
                    </code>
                  </pre>
                </div>
              </div>

              {/* THINKING BOX */}
              <div
                className={`mt-6 rounded-2xl border border-amber-500/20 ${
                  isDark
                    ? "bg-amber-500/[0.04]"
                    : "bg-amber-50"
                } p-5`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <FaLightbulb />
                  </div>

                  <div>
                    <p className="font-bold text-amber-400">
                      Interview Tip
                    </p>

                    <p
                      className={`mt-1 text-sm leading-6 ${muted}`}
                    >
                      First try solving the problem yourself.
                      Explain your approach, time complexity,
                      and space complexity before checking the
                      solution.
                    </p>
                  </div>
                </div>
              </div>

              {/* TEST CASES */}
              <div className="mt-8">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                    Test Cases
                  </p>

                  <h3 className="mt-1 text-lg font-black">
                    Verify your solution
                  </h3>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1fr_1fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <span>Input</span>
                    <span>Expected Output</span>
                  </div>

                  {question.testCases.map(
                    ([input, output], index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr] border-b border-white/10 px-4 py-4 last:border-b-0"
                      >
                        <code className="pr-3 text-xs text-zinc-300 sm:text-sm">
                          {input}
                        </code>

                        <code className="text-xs font-semibold text-emerald-400 sm:text-sm">
                          {output}
                        </code>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* REVEAL */}
              <div className="mt-8">
                <button
                  onClick={() =>
                    setShowAnswer((prev) => !prev)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01]"
                >
                  <FaLightbulb />

                  {showAnswer
                    ? "Hide Solution"
                    : "Reveal Solution Approach"}

                  {showAnswer ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>

                {showAnswer && (
                  <div
                    className={`mt-4 rounded-2xl border border-violet-500/20 ${
                      isDark
                        ? "bg-violet-500/[0.05]"
                        : "bg-violet-50"
                    } p-5`}
                  >
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <FaCheckCircle />
                      </div>

                      <div>
                        <h4 className="font-bold">
                          Solution Approach
                        </h4>

                        <p
                          className={`mt-2 text-sm leading-7 ${muted}`}
                        >
                          Try to understand the pattern used in
                          the solution rather than memorizing the
                          code. In a real interview, explain your
                          brute-force approach first, then optimize
                          it using the appropriate data structure
                          or algorithm.
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div
                            className={`rounded-xl border ${border} p-4`}
                          >
                            <p className="text-xs font-bold uppercase text-violet-400">
                              Interview Focus
                            </p>

                            <p
                              className={`mt-2 text-sm ${muted}`}
                            >
                              Explain why this approach is
                              efficient and what trade-offs it
                              makes.
                            </p>
                          </div>

                          <div
                            className={`rounded-xl border ${border} p-4`}
                          >
                            <p className="text-xs font-bold uppercase text-emerald-400">
                              Complexity
                            </p>

                            <p
                              className={`mt-2 text-sm ${muted}`}
                            >
                              Be ready to explain both time and
                              space complexity to the interviewer.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* NAVIGATION */}
              <div
                className={`mt-8 flex flex-col gap-3 border-t ${border} pt-7 sm:flex-row sm:items-center sm:justify-between`}
              >
                <button
                  onClick={previousQuestion}
                  disabled={current === 0}
                  className={`flex items-center justify-center gap-2 rounded-xl border ${border} px-5 py-3 text-sm font-bold transition ${
                    current === 0
                      ? "cursor-not-allowed opacity-40"
                      : isDark
                      ? "hover:bg-white/10"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <FaArrowLeft />
                  Previous
                </button>

                <button
                  onClick={markCompleted}
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                    isCurrentCompleted
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                  }`}
                >
                  <FaCheckCircle />
                  {isCurrentCompleted
                    ? "Completed"
                    : "Mark as Completed"}
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={current === allQuestions.length - 1}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition ${
                    current === allQuestions.length - 1
                      ? "cursor-not-allowed opacity-40"
                      : "hover:scale-[1.02]"
                  }`}
                >
                  Next Question
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COMPLETE BATCH */}
        {isBatchComplete && (
          <section className="mt-8">
            <div
              className={`relative overflow-hidden rounded-3xl border border-emerald-500/20 ${
                isDark
                  ? "bg-emerald-500/[0.04]"
                  : "bg-emerald-50"
              } p-6 text-center sm:p-10`}
            >
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-lg">
                  <FaTrophy className="text-2xl" />
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                  SET COMPLETED
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  🎉 Amazing! You completed this set
                </h2>

                <p
                  className={`mx-auto mt-3 max-w-2xl text-sm leading-6 ${muted}`}
                >
                  You successfully completed all{" "}
                  {allQuestions.length} coding interview
                  challenges. Keep going and improve your
                  problem-solving speed.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  {allQuestions.length < 40 ? (
                    <button
                      onClick={loadMoreQuestions}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
                    >
                      More 20 Interview Questions
                      <FaArrowRight />
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3.5 text-sm font-bold text-emerald-400">
                        ✓ You unlocked all 40 questions
                      </div>

                      <button
                        onClick={resetPractice}
                        className={`flex items-center justify-center gap-2 rounded-xl border ${border} px-5 py-3.5 text-sm font-bold transition ${
                          isDark
                            ? "hover:bg-white/10"
                            : "hover:bg-white"
                        }`}
                      >
                        Practice Again
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate("/")}
                    className={`flex items-center justify-center gap-2 rounded-xl border ${border} px-5 py-3.5 text-sm font-bold transition ${
                      isDark
                        ? "hover:bg-white/10"
                        : "hover:bg-white"
                    }`}
                  >
                    <FaHome />
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BOTTOM CTA */}
        {!isBatchComplete && (
          <section className="mt-8">
            <div
              className={`rounded-2xl border ${border} ${card} p-5`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">
                    Keep practicing 💪
                  </p>

                  <p
                    className={`mt-1 text-sm ${muted}`}
                  >
                    Don&apos;t reveal the solution until you have
                    tried the problem yourself.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/")}
                    className={`flex items-center gap-2 rounded-xl border ${border} px-4 py-2.5 text-sm font-semibold transition ${
                      isDark
                        ? "hover:bg-white/10"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <FaHome />
                    Home
                  </button>

                  {current < allQuestions.length - 1 && (
                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                    >
                      Next
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}