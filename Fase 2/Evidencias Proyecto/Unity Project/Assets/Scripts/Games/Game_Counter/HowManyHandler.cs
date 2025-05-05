using UnityEngine;
using UnityEngine.Events;

public class HowManyHandler : MonoBehaviour
{
    public UnityEvent OnWin;
    public UnityEvent OnLose;

    public void TriggerButton(int id){
        if (id == 1){
            if(OnWin != null) OnWin.Invoke();
        }else{
            if(OnLose != null) OnLose.Invoke();
        }
    }
}
