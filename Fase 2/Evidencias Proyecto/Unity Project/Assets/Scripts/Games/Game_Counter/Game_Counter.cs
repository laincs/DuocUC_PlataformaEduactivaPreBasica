using UnityEngine;
using UnityEngine.Events;

public class Game_Counter : MonoBehaviour
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
