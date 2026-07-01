# NVIDIA NIM integration

This document describes how to configure 7YA to use NVIDIA NIM APIs via the integration patch.

## Environment variables (Vercel)

Set the following environment variables in your Vercel project:

```
NVIDIA_API_KEY=<your NIM API key>
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_NIM_MODEL=<model ID copied from the NIM dashboard 'View code'>
NVIDIA_NIM_PUBLIC_ENABLED=false
```

After deploying and testing, you can enable public access by setting `NVIDIA_NIM_PUBLIC_ENABLED` to `true`.

## Testing

Visit `/api/nvidia` to call the NIM API via your backend. Visit `/nvidia/` for a test page in the UI.
