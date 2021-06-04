import fire from '../config/fire-config';

const uploadResponses = async ({ data }) => {
    const response = await fire.firestore().collection('responses').add(data);
    return response.id
}

export default uploadResponses;

