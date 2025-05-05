using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class TimerEvent : MonoBehaviour
{
    [Header("Config")]
    public int time;
    public UnityEvent unityEvent;
    void OnEnable(){
        StartCoroutine(TimerCoroutine());
    }

    IEnumerator TimerCoroutine(){
        yield return new WaitForSeconds(time);
        if(unityEvent != null) unityEvent.Invoke();
    }
}
