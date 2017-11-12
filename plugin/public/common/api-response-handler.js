export function handleApiResponse(response) {

    if (response.status > 299) {
        const error = new Error(response.statusText);
        error.response = response;
        error.status = response.status;
        throw error;
    }
    return response
        .json()
        .then(json => {
            return json;
        })
        .catch(err => {
            return response;
        });
}

