using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using System.Text;
using System;

public static class WebServices
{
    private static string supabaseUrl = "https://gcodmdutjqcvzmzmcqyo.supabase.co";
    private static string apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdjb2RtZHV0anFjdnptem1jcXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODY4MjUsImV4cCI6MjA2MjU2MjgyNX0.eJD3zIn6HmUlVv97CdOZmvCObAqEsmsMfIJqxoL6Qdo";

    public static IEnumerator Login(string email, string password, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{supabaseUrl}/auth/v1/token?grant_type=password";

        LoginRequest requestData = new LoginRequest
        {
            email = email,
            password = password
        };

        string jsonData = JsonUtility.ToJson(requestData);

        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("apikey", apiKey);

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                onSuccess?.Invoke(request.downloadHandler.text);
            }
            else
            {
                onError?.Invoke(request.downloadHandler.text);
            }
        }
    }

    [Serializable]
    private class LoginRequest
    {
        public string email;
        public string password;
    }
}
