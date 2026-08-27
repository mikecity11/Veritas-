# Deployment checklist

1. Run `npm test` and `npm run build` on Windows.
2. To deploy everything on Vercel: create a GitHub repository from this folder, import it at [vercel.com/new](https://vercel.com/new), leave the detected settings alone, and click **Deploy**. The `api/research.js` serverless function is included for Vercel. Do **not** add `VITE_API_URL` in Vercel; it uses the same site's API route.
3. For a split deployment instead, host `frontend/dist`; set `VITE_API_URL` to the HTTPS backend URL while building and host `backend` separately.
4. Add HTTPS, request-rate limits, structured logs, and a source-result cache before public launch.
5. Deploy and test `contracts/VeritasRegistry.py` in GenLayer Studio. Copy the contract address to the server environment only after validating the access model.
6. Add a wallet flow or a secret-store-backed signer only after selecting the target GenLayer network and reviewing the current official integration documentation.
