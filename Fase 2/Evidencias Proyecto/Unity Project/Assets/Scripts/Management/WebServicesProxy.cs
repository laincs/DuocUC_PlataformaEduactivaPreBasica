using UnityEngine;
using TMPro;
using UnityEngine.Events;

public class WebServicesProxy : MonoBehaviour
{
    [Header("Login Flow")]
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public UnityEvent OnLoginSuccess;
    public UnityEvent OnLoginError;

    public void OnLoginButtonClicked()
    {
        string email = emailInput.text;
        string password = passwordInput.text;

        StartCoroutine(WebServices.Login(email, password,
            onSuccess: (response) =>
            {
                if (OnLoginSuccess != null) OnLoginSuccess.Invoke();
                Debug.Log("Login exitoso: " + response);
            },
            onError: (error) =>
            {
                if (OnLoginError != null) OnLoginError.Invoke();
                Debug.Log("Error en login: " + error);
            }));
    }

     
}
