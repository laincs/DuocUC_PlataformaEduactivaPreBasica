using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class SessionWaiting : MonoBehaviour
{
    public WebServicesProxy webServicesProxy;
    public UnityEvent OnOpenSessionFound;
    public GameObject[] games;

    private bool sessionOpenDetected = false;

    void Start()
    {
        sessionOpenDetected = false;
        StartCoroutine(CheckForOpenSessionLoop());
    }

    IEnumerator CheckForOpenSessionLoop()
    {
        while (!sessionOpenDetected)
        {
            yield return StartCoroutine(WebServices.GetSessions(
                webServicesProxy.currentUser.grade,
                webServicesProxy.currentUser.location,
                onSuccess: (response) =>
                {
                    var sessionResponse = JsonUtility.FromJson<SessionResponse>(response);
                    if (sessionResponse != null && sessionResponse.success && sessionResponse.data != null)
                    {
                        foreach (var session in sessionResponse.data)
                        {
                            if (session.status == "open")
                            {
                                sessionOpenDetected = true;
                                Debug.Log($"Sesión abierta encontrada: {session.game_id}");

                                // ✅ Activar juego correspondiente
                                ActivateGameById(session.game_id);

                                // ✅ Registrar inicio de sesión
                                webServicesProxy.StartSession(session.id);

                                // ✅ Llamar evento Unity opcional (por si quieres enganchar algo en el editor)
                                OnOpenSessionFound?.Invoke();
                                break;
                            }
                        }
                    }
                },
                onError: (error) =>
                {
                    Debug.LogWarning("Error al verificar sesiones: " + error);
                }
            ));

            yield return new WaitForSeconds(1f);
        }
    }

    void ActivateGameById(string gameId)
    {
        for (int i = 0; i < games.Length; i++)
        {
            if (games[i] != null)
                games[i].SetActive(false);
        }

        int index = int.Parse(gameId[^1].ToString())-1;
        if (index >= 0 && index < games.Length)
        {
            games[index].SetActive(true);
            Debug.Log($"Juego activado: {games[index].name}");
        }
        else
        {
            Debug.LogWarning($"No se encontró juego para ID: {gameId}");
        }
    }
}
