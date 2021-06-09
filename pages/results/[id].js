import { useEffect, useState } from 'react';
import fire from '../../config/fire-config';

const useResults = ({ id }) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [percentDist, setPercentDist] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [careerDist, setCareerDist] = useState([0, 0, 0, 0, 0, 0, 0])

    useEffect(() => {
        const getData = async () => {
            // retrieve data from firestore
            const snapshot = await fire.firestore().collection('responses').get()

            const documents = {}
            snapshot.forEach(doc => {
                documents[doc.id] = doc.data();
            });

            setData(documents)

            // construct percentage distributions array
            const values = Object.values(documents)
            const pDist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            for (let i = 0; i < values.length; i += 1) {
                const idx = Math.floor(values[i].RESULT / 10)
                pDist[idx] += 1
            }

            setPercentDist(pDist)

            // construct career plans distributions array
            const cDist = [0, 0, 0, 0, 0, 0, 0]
            for (let i = 0; i < values.length; i += 1) {
                cDist[values[i].ANSWER] += 1
            }

            setCareerDist(cDist)

            // set loading to finished
            setLoading(false)
        }
        getData();
    }, [])

    return [data, percentDist, careerDist, loading];
}

const Results = ({ id }) => {

    const [data, percentageDistribution, careerDistribution, isLoading] = useResults({id});

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