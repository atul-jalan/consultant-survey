const transformResponses = ({ questions, responses }) => {
    const data = []
    for (let i = 0; i < questions.length; i += 1) {
        const newRow = []
        for (let j = 0; j < questions[i].choices.length; j += 1) {
            newRow.push(0)
        }
        newRow[responses[questions[i].id]] = 1
        data.push(newRow)
    }
    return data
}

export default transformResponses;