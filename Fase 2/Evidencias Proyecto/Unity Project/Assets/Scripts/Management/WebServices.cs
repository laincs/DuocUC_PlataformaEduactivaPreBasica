using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using System.Text;
using System;

public static class WebServices
{
    private static string baseUrl = "http://localhost:3000";

    public static IEnumerator Login(string email, string password, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{baseUrl}/auth/login";

        string jsonData = $"{{\"email\":\"{email}\",\"password\":\"{password}\"}}";

        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

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

    public static IEnumerator GetSessions(string grade, string location, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"http://localhost:3000/sessions?grade={UnityWebRequest.EscapeURL(grade)}&location={UnityWebRequest.EscapeURL(location)}";

        using (UnityWebRequest request = UnityWebRequest.Get(endpoint))
        {
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

    public static IEnumerator CreateSession(string gameId, string grade, string location, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{baseUrl}/sessions";

        string jsonData = $"{{\"game_id\":\"{gameId}\",\"grade\":\"{grade}\",\"location\":\"{location}\"}}";

        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

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

    public static IEnumerator GetSessionStatus(int sessionId, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{baseUrl}/sessions/{sessionId}/status";

        using (UnityWebRequest request = UnityWebRequest.Get(endpoint))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                onSuccess?.Invoke(request.downloadHandler.text);
            }
            else
            {
                onError?.Invoke(request.error);
            }
        }
    }




    public static IEnumerator GetSessionUsers(string sessionId, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{baseUrl}/sessions/{sessionId}/users";

        using (UnityWebRequest request = UnityWebRequest.Get(endpoint))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                onSuccess?.Invoke(request.downloadHandler.text);
            }
            else
            {
                onError?.Invoke(request.error);
            }
        }
    }

    public static IEnumerator CloseSession(int sessionId, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{baseUrl}/sessions/{sessionId}/close";

        using (UnityWebRequest request = UnityWebRequest.Put(endpoint, ""))
        {
            request.SetRequestHeader("Content-Type", "application/json");

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

    
    public static IEnumerator RegisterSessionStart(int sessionId, int userId, Action<string> onSuccess, Action<string> onError)
    {
        Debug.Log($"SESSION {sessionId} - {userId}");
        string endpoint = $"{baseUrl}/sessions/{sessionId}/start";

        string jsonData = $"{{\"user_id\":{userId}}}";

        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

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

    public static IEnumerator RegisterSessionEnd(int sessionId, int userId, Action<string> onSuccess, Action<string> onError)
    {
        string endpoint = $"{baseUrl}/sessions/{sessionId}/end";

        string jsonData = $"{{\"user_id\":{userId}}}";

        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

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


}
