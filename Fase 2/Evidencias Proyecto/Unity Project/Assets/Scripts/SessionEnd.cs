using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class SessionEnd : MonoBehaviour
{
    public GameObject closeObject;
    public GameObject thanksObject;
    public UnityEvent OnEndTimer;
    void OnEnable()
    {
        closeObject.SetActive(true);
        thanksObject.SetActive(false);
        StartCoroutine(Timer());
    }

    IEnumerator Timer()
    {
        yield return new WaitForSeconds(2f);
        closeObject.SetActive(false);
        thanksObject.SetActive(true);
        yield return new WaitForSeconds(5f);
        closeObject.SetActive(false);
        thanksObject.SetActive(false);
        
        OnEndTimer.Invoke();
    }
}
