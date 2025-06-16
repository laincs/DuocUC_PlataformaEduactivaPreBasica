using UnityEngine;
using UnityEngine.Events;

public class StudentWatcher : MonoBehaviour
{
    float timer = 0f;
    float timerWall = 2f;
    public WebServicesProxy webServicesProxy;

    public void OnEnable()
    {
        timer = 0f;
    }
    void Update()
    {
        timer += Time.deltaTime;

        if (timer >= timerWall)
        {
            timer = 0f;
            CheckGameStatus();
        }
    }

    public void CheckGameStatus()
    {
        webServicesProxy.CheckIfSessionActiveAndEnd();
    }
}
