import fire from '../../config/fire-config';

const Results = ({ id, stats }) => {
    console.log(stats)
    return (
        <div>
            <p>{stats[id].RESULT}%</p>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    const snapshot = await fire.firestore().collection('responses').get()

    const documents = {}
    snapshot.forEach(doc => {
        documents[doc.id] = doc.data();
    });

    return {
        props: {
            id,
            stats: documents
        },
    }
}

export default Results;