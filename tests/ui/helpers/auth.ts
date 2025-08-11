type SignUpOptions = {
    // When true, do not throw if the email is already registered (default: true)
    tolerateExisting?: boolean;
};

export async function signUpUser(
    email: string,
    password: string,
    name = 'Test User',
    opts: SignUpOptions = { tolerateExisting: true },
) {
    const url = `${process.env.API_URL}auth/register`;

    // Sanitize name: allow only letters and spaces (backend forbids digits/special chars)
    const safeName =
        name
            .replace(/[^A-Za-z\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim() || 'Test User';

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, name: safeName, password }),
    });

    if (res.ok) return;

    const status = res.status;
    const text = await res.text();

    // Tolerate "already exists" cases even if backend returns 400 or 500
    try {
        const json = JSON.parse(text);
        const alreadyExists =
            /email already in use/i.test(String(json?.message)) || /duplicate key value/i.test(String(json?.message));

        if ((opts.tolerateExisting ?? true) && alreadyExists) {
            return; // treat as "user is ready"
        }
    } catch {
        // Ignore JSON parse errors; fall through to throw
    }

    throw new Error(`Sign up failed: ${status} ${text}`);
}
