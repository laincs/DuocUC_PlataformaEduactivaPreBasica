using System.Collections;
using UnityEngine;

public class GameStager : MonoBehaviour
{
    public GameObject[] GameStages;
    public GameObject StageFeedback;
    public int currentStage;

    public void OnEnable()
    {
        currentStage = 0;
    }

    IEnumerator ShowFeedbackIEnumerator()
    {
        StageFeedback.SetActive(true);
        yield return new WaitForSeconds(2f);
        StageFeedback.SetActive(false);
        GoNextStage();
    }

    public void GoNextStage()
    {
        for (int i = 0; i < GameStages.Length; i++)
        {
            GameStages[i].SetActive(false);
        }

        if (currentStage + 1 >= GameStages.Length)
        {
            //END GAME
        }
        else
        {
            GameStages[currentStage + 1].SetActive(true);
            currentStage++;
        }
    }

    public void TriggerWin()
    {
        StartCoroutine(ShowFeedbackIEnumerator());
    }
}
