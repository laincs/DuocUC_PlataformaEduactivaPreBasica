using UnityEngine;
using TMPro;
using System.Collections;

public class SessionUserDisplay : MonoBehaviour
{
    public WebServicesProxy webServicesProxy;
    public GameObject prefab;
    public GameObject targetContainer;

    public float refreshInterval = 5f;

    float time = 0f;
    string lastRawResponse = "";

    void Update()
    {
        time += Time.deltaTime;
        if (time > refreshInterval)
        {
            time = 0;
            UpdateUsersList();
        }
    }

    private void UpdateUsersList()
    {
        string sessionId = webServicesProxy.sessions[^1].id.ToString();

        StartCoroutine(WebServices.GetSessionUsers(sessionId,
            onSuccess: (response) =>
            {
                if (response == lastRawResponse)
                {
                    return;
                }

                lastRawResponse = response;

                SessionUsersResponse usersResponse = JsonUtility.FromJson<SessionUsersResponse>(response);
                if (usersResponse != null && usersResponse.success && usersResponse.data != null)
                {
                    foreach (Transform child in targetContainer.transform)
                    {
                        Destroy(child.gameObject);
                    }

                    foreach (var user in usersResponse.data)
                    {
                        GameObject newUserObj = Instantiate(prefab, targetContainer.transform);
                        newUserObj.GetComponent<SessionUserStudent>().UpdateTMP(
                            user.name,
                            user.email,
                            user.left_at == null ? "En sesión" : "Terminó",
                            user.joined_at
                        );
                    }
                }
            },
            onError: (error) =>
            {
                Debug.LogError("Error al obtener usuarios: " + error);
            }
        ));
    }
}
