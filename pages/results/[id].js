import { useEffect, useState } from 'react';
import fire from '../../config/fire-config';

const Results = ({ id }) => {

    const [results, setResults] = useState("")

    useEffect(() => {
        const getData = async () => {
            const snapshot = await fire.firestore().collection('responses').get()

            const documents = {}
            snapshot.forEach(doc => {
                documents[doc.id] = doc.data();
            });

            setResults(documents[id].RESULT + '%')
        }
        getData();
    }, [])
    
    return (
        <div>
            <p>{results}</p>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    return {
        props: {
            id
        },
    }
}

export default Results;