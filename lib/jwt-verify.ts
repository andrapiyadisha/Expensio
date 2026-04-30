async function hmacSha256(key: string, data: string) {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function verifyJwt(token: string, secret: string) {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split(".");
        if (!headerB64 || !payloadB64 || !signatureB64) return null;

        const data = `${headerB64}.${payloadB64}`;
        const expectedSignature = await hmacSha256(secret, data);

        if (signatureB64 !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(atob(payloadB64));

        if (payload.exp && Date.now() / 1000 > payload.exp) {
            return null;
        }

        return payload;
    } catch (error) {
        return null;
    }
}
