//-------------one-at-a-time

export function crudCreate(url, object) {
    return fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
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
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
        },
    })
}

export function crudUpdate(url, id) {
    return fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
        },
        body: JSON.stringify({
            name: 'Updated Item',
            description: 'Updated description of the item',
        }), // сюда засунуть обновляемый объект
    })
}

export function crudDelete(url, id) {
    return fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
        },
    })
}

//--------------------many

export function crudReadMany(url, page = 0, size = 10) {
    return fetch(`${url}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
        },
    });
}

export function crudDeleteMany(url) {
    return fetch(`${url}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
        }
    })
}