using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class SessionWaiting : MonoBehaviour
{
    public WebServicesProxy webServicesProxy;
    public UnityEvent OnOpenSessionFound;
    public GameObject[] games;

    [Header("Text References")]
    public GameObject WaitingObject;
    public GameObject SessionFound;
    public GameObject Counter_3;
    public GameObject Counter_2;
    public GameObject A_Jugar;
    public StudentWatcher[] studentWatchers;

    private bool sessionOpenDetected = false;

    void OnEnable()
    {
        WaitingObject.SetActive(true);
        SessionFound.SetActive(false);
        Counter_3.SetActive(false);
        Counter_2.SetActive(false);
        A_Jugar.SetActive(false);

        sessionOpenDetected = false;
        StartCoroutine(CheckForOpenSessionLoop());
    }

    IEnumerator TriggerSession(string game_id, int session_id)
    {
        yield return new WaitForSeconds(1.5f);
        WaitingObject.SetActive(false);
        SessionFound.SetActive(true);
        yield return new WaitForSeconds(1.5f);
        Counter_3.SetActive(true);
        yield return new WaitForSeconds(1.5f);
        Counter_2.SetActive(true);
        yield return new WaitForSeconds(1.5f);
        A_Jugar.SetActive(true);
        yield return new WaitForSeconds(1.5f);
        ActivateGameById(game_id);
        webServicesProxy.StartSession(session_id);
        OnOpenSessionFound?.Invoke();
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
                        for (int i = sessionResponse.data.Length - 1; i >= 0; i--)
                        {
                            var session = sessionResponse.data[i];
                            if (session.status == "open")
                            {
                                sessionOpenDetected = true;
                                Debug.Log($"Sesión abierta encontrada: {session.game_id} - {session.id}");

                                StartCoroutine(TriggerSession(session.game_id, session.id));
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
