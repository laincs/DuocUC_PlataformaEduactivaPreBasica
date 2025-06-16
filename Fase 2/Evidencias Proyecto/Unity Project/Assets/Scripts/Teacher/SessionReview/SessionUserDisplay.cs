using UnityEngine;
using TMPro;
using System.Collections;

public class SessionUserDisplay : MonoBehaviour
{
    public WebServicesProxy webServicesProxy;
    public GameObject prefab;
    public GameObject targetContainer;

    public TMP_Text gameText;
    public TMP_Text stateText;
    public TMP_Text gradeText;

    public float refreshInterval = 5f;

    float time = 0f;
    public string lastRawResponse = "";

    void Update()
    {
        time += Time.deltaTime;
        if (time > refreshInterval)
        {
            time = 0;

            webServicesProxy.GetUserSessions();
            UpdateUsersList();
        }
    }

    public string GetGameName(int targetID)
    {
        return (targetID - 1) switch
        {
            0 => "Dibujar",
            1 => "ContarObjectos",
            2 => "Asociacion",
            _ => "Other",
        };
    }

    private void UpdateUsersList()
    {

        string sessionId = webServicesProxy.sessions[^1].id.ToString();
        gameText.text = GetGameName(int.Parse(webServicesProxy.sessions[^1].game_id));
        stateText.text = webServicesProxy.sessions[^1].status;
        gradeText.text = webServicesProxy.sessions[^1].grade_name;

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
                            user.left_at == "" ? "En sesión" : "Terminó",
                            user.joined_at
                        );
                    }
                }
            },
            onError: (error) =>
            {
                Debug.LogError("Error al obtener usuarios: " + error);

                gameText.text = "----";
                stateText.text = "----";
                gradeText.text = "----";
            }
        ));
    }
}
