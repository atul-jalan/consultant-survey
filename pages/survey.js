import React, { useReducer } from 'react';
import { questions, model, transformResponses, uploadResponses } from '../dataflow';
import { useRouter } from 'next/router'

const reducer = (state, action) => {
    switch (action.type) {
        case 'select': {
            if (action.payload.id in state && state[action.payload.id] === action.payload.choiceIdx) {
                const copy = {...state}
                delete copy[action.payload.id]
                return copy
            }

            return {
                ...state,
                [action.payload.id]: action.payload.choiceIdx
            }
        }
    }
}

const Survey = () => {
    const router = useRouter()

    const [state, dispatch] = useReducer(reducer, {})

    const onSubmitSurvey = async () => {
        if (Object.keys(state).length !== questions.length) {
            alert('Uh oh! You didn\'t answer all the questions.')
            return;
        }

        const transformed = transformResponses({questions, responses: state});

        const modelInput = [...transformed]
        modelInput.pop()
        const result = model({answers: modelInput})

        const stateCopy = {...state}
        stateCopy['RESULT'] = result

        const id = await uploadResponses({data: stateCopy})

        router.push('/results/' + id)
    }

    return (
        <div className="fullpage bg-color-background flex justify-center align-start padding-32" style={{overflow: 'scroll'}}>
            <div className="white-color-background padding-16" style={{width: '600px'}}>
                <p style={{alignSelf: 'stretch', textAlign: 'center'}} className="font-main h1 primary-accent fw-black marginbottom-24 margintop-8 font-italic">Are you a consultant?</p>
                <p style={{alignSelf: 'stretch', textAlign: 'center'}} className="font-main h1 primary-accent fw-black marginbottom-24 margintop-8">💰💰💰💰💰💰💰💰💰</p>
                {questions.map((question, idx) => (
                    <Question key={question.id} idx={idx} data={question} selected={question.id in state ? state[question.id] : null} onSelect={(choiceIdx) => dispatch({type: 'select', payload: {choiceIdx, id: question.id}})} />
                ))}
                <div style={{width: '100%'}} className="flex justify-center">
                    <div style={{width: '200px', maxWidth: '50%'}} className="secondary-accent-background padding-16 flex justify-center br-reg btn" onClick={onSubmitSurvey}>
                        <p className="white-color font-main fw-medium">See your results</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Question = ({idx, data, selected, onSelect}) => {
    return (
        <div className="marginbottom-32">
            <p className="font-main h3 text-color fw-medium paddingbottom-8">{idx + 1}. {data.title}</p>
            {data.choices.map((choice, idx) => (
                <QuestionChoice key={choice} choice={choice} isSelected={idx === selected} onClick={() => onSelect(idx)} />
            ))}
        </div>
    )
}

const QuestionChoice = ({ choice, isSelected, onClick }) => {

    const selectedBgStyle = {
        backgroundColor: isSelected ? 'rgba(25, 42, 81, .2)' : 'transparent',
        cursor: 'pointer'
    }

    const selectedDotStyle = {
        borderWidth: isSelected ? '0px' : '1.5px',
        backgroundColor: isSelected ? 'rgb(25, 42, 81)' : 'transparent'
    }

    return (
        <div style={selectedBgStyle} className="flex flex-row justify-start align-center paddingleft-16 paddingtop-8 paddingbottom-8 br-reg" onClick={onClick}>
            <div className="marginright-8" style={{...selectedDotStyle, height: "20px", width: "20px", borderColor: "#220901", borderStyle: "solid", borderRadius: "20px"}}></div>
            <p className="font-main text-color">{choice}</p>
        </div>
    )
}

export default Survey;