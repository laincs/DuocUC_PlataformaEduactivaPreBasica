using UnityEngine;
using TMPro;
using UnityEngine.Events;

public class WebServicesProxy : MonoBehaviour
{
    [Header("DB Data")]
    public UserData currentUser;
    public Session[] sessions;


    [Header("Login Flow")]
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public UnityEvent OnLoginError;
    public UnityEvent OnLoginSuccess;
    public UnityEvent OnLoginSuccess_Student;
    public UnityEvent OnLoginSuccess_Teacher;

    [Header("Session Create Flow")]
    public UnityEvent OnCreateSuccess;

    public void OnLoginButtonClicked()
    {
        string email = emailInput.text;
        string password = passwordInput.text;

        StartCoroutine(WebServices.Login(email, password,
            onSuccess: (response) =>
            {
                currentUser = JsonUtility.FromJson<UserData>(response);
                OnLoginSuccess?.Invoke();
                if (currentUser.userType == "teacher")
                {
                    OnLoginSuccess_Teacher?.Invoke();
                }
                else
                {
                    OnLoginSuccess_Student?.Invoke();
                }
                Debug.Log("Login exitoso: " + response);
                GetUserSessions();

            },
            onError: (error) =>
            {
                OnLoginError?.Invoke();
                Debug.Log("Error en login: " + error);
            }));

    }

    public void GetUserSessions()
    {
        string grade = currentUser.grade;
        string location = currentUser.location;

        StartCoroutine(WebServices.GetSessions(grade, location,
            onSuccess: (response) =>
            {
                Debug.Log("Respuesta JSON completa:\n" + response);

                SessionResponse sessionResponse = JsonUtility.FromJson<SessionResponse>(response);

                if (sessionResponse != null && sessionResponse.success && sessionResponse.data != null)
                {
                    sessions = sessionResponse.data;
                    Debug.Log($"Sesiones obtenidas: {sessions.Length}");
                }
                else
                {
                    Debug.LogWarning("No se pudieron parsear las sesiones correctamente");
                }
            },
            onError: (error) =>
            {
                Debug.LogError("Error al obtener sesiones: " + error);
            }));
    }

    public void CreateNewSession(string gameId)
    {
        StartCoroutine(WebServices.CreateSession(gameId, currentUser.grade, currentUser.location,
            onSuccess: (response) =>
            {
                OnCreateSuccess?.Invoke();
                Debug.Log("Sesión creada con éxito: " + response);
                GetUserSessions();
            },
            onError: (error) =>
            {
                Debug.LogError("Error al crear sesión: " + error);
            }
        ));
    }

    
    public void StartSession(int sessionId)
    {
        StartCoroutine(WebServices.RegisterSessionStart(
            sessionId,
            currentUser.userId,
            onSuccess: (response) =>
            {
                Debug.Log($"Inicio de sesión registrado correctamente: {response}");
            },
            onError: (error) =>
            {
                Debug.LogWarning($"Error al registrar inicio de sesión: {error}");
            }
        ));
    }

    public void EndSession(int sessionId)
    {
        StartCoroutine(WebServices.RegisterSessionEnd(
            sessionId,
            currentUser.userId,
            onSuccess: (response) =>
            {
                Debug.Log($"Fin de sesión registrado correctamente: {response}");
            },
            onError: (error) =>
            {
                Debug.LogWarning($"Error al registrar fin de sesión: {error}");
            }
        ));
    }
}
