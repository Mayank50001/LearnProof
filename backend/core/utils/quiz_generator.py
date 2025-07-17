def generate_quiz(title, description):
    return [
        {
            "question" : f"What is the main idea of {title}?",
            "options" : ["A", "B" , "C", "D"],
            "answer" : "A"
        },
        {
            "question": "Which of these is correct?",
            "options": ["X", "Y", "Z", "W"],
            "answer": "Y"
        }
    ]