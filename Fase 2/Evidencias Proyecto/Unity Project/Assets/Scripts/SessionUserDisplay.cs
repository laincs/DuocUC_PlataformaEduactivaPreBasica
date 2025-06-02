using UnityEngine;
using TMPro;

public class SessionUserDisplay : MonoBehaviour
{
    public WebServicesProxy webServicesProxy;
    public TMP_Text usersText;

    public float refreshInterval = 5f;

    float time = 1f;
    float refresh = 1f;

    void Update()
    {
        time += Time.deltaTime;
        if (time > refresh)
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
                SessionUsersResponse usersResponse = JsonUtility.FromJson<SessionUsersResponse>(response);
                if (usersResponse != null && usersResponse.success && usersResponse.data != null)
                {
                    string display = "Estudiantes en sesión:\n";
                    foreach (var user in usersResponse.data)
                    {
                        string status = user.left_at == null ? "En sesión" : "Terminó";
                        display += $"- {user.name} ({status})\n";
                    }
                    usersText.text = display;
                }
                else
                {
                    usersText.text = "No se encontraron usuarios en la sesión.";
                }
            },
            onError: (error) =>
            {
                usersText.text = "Error al cargar usuarios.";
                Debug.LogError("Error al obtener usuarios: " + error);
            }
        ));
    }
}
