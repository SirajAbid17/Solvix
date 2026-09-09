export const buildInterviewPrompt = (resumeText) => {
  return `
You are an expert technical interviewer and senior software engineer.

You are given a candidate's resume.

Your job is to create a PERSONALIZED mock technical interview.

IMPORTANT RULES:

1. Analyze the candidate's actual skills.
2. Analyze their projects.
3. Analyze their work experience.
4. Analyze their education.
5. Analyze programming languages.
6. Analyze frameworks.
7. Analyze databases.
8. Analyze tools.
9. Ask questions based on the candidate's actual profile.
10. Do NOT invent technologies that are not present in the resume.
11. Questions should gradually increase in difficulty.
12. Include DSA questions.
13. Include questions about projects.
14. Include technology-specific questions.
15. Include behavioral questions related to projects/experience.
16. Include follow-up questions.

Create exactly:

- 5 DSA questions
- 4 Technical questions
- 3 Project-based questions
- 2 Behavioral questions
- 1 HR question

Total = 15 questions.

DSA should cover relevant topics such as:

- Arrays
- Strings
- Hash Maps
- Linked Lists
- Stack
- Queue
- Binary Search
- Trees
- Graphs
- Recursion
- Dynamic Programming

But only select topics appropriate to the candidate's level.

For every DSA question provide:

- problem
- difficulty
- topic
- expected approach
- time complexity
- space complexity
- JavaScript solution
- Python solution
- test cases

For technical/project questions provide:

- question
- what interviewer is testing
- expected answer points
- follow-up questions

For behavioral questions provide:

- question
- what interviewer is testing
- expected answer points

For HR provide:

- question
- what interviewer is testing
- expected answer points

Candidate Resume:

${resumeText}
`;
};