export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    let token = null;
    let empresaId = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                empresaId = user.empresaId;
            }
        } catch (e) { }
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
            headers[key] = String(value);
        });
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (empresaId) {
        headers['X-Empresa-Id'] = empresaId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMsg = 'Error en la petición';
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (e) {
            // no json response
        }
        throw new Error(errorMsg);
    }

    return response.json();
};
