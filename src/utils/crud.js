// -------------------- one-at-a-time

export function crudCreate(url, object) {
    return fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(object),
    })
    //  удалена обработка !response.ok, response.status === 401, catch, превращение в json
}

export function crudRead(url, id) {
    return fetch(`${url}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
        },
    })
}

export function crudUpdate(url, id, object=null) {
    return fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
        },
        body: JSON.stringify(object), // сюда засунуть обновляемый объект
    })
}

export function crudDelete(url, id) {
    return fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
        },
    })
}

// -------------------- many

export function crudReadMany(
        url,
        page = 0,
        size = 10,
        filterValue="",
        filterCol="",
        sortBy="",
        sortDir=""
    ) {
    return fetch(`${url}?page=${page}&size=${size}&filterValue=${filterValue}&filterCol=${filterCol}&sortBy=${sortBy}&sortDir=${sortDir}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
        },
    });
}

export function crudDeleteMany(url) {
    return fetch(`${url}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
        }
    })
}

// -------------------- ping

export function ping(url) {
    return fetch(`${url}/ping`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
        },
    })
}
