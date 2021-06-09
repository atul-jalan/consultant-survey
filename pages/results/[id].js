import { useEffect, useState } from 'react';
import fire from '../../config/fire-config';

const useResults = ({ id }) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const snapshot = await fire.firestore().collection('responses').get()

            const documents = {}
            snapshot.forEach(doc => {
                documents[doc.id] = doc.data();
            });

            setData(documents)
            setLoading(false)
        }
        getData();
    }, [])

    return [data, loading];
}

const Results = ({ id }) => {

    const [data, isLoading] = useResults({id});

    if (isLoading) return <p>Loading...</p>
    
    return (
        <div className="flex justify-center align-center bg-color-background padding-32">
            <div className="font-main flex justify-center align-center">
                <p className="font-main h1 fw-black primary-accent"><span className="secondary-accent">Your chances of becoming a consultant: </span>{Math.round(data[id].RESULT)}%</p>
            </div>
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