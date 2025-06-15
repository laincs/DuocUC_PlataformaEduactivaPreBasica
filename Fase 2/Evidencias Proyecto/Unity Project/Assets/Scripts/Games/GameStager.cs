using System.Collections;
using UnityEngine;

public class GameStager : MonoBehaviour
{
    public GameObject[] GameStages;
    public GameObject StageFeedback_Positive;
    public GameObject StageFeedback_Negative;
    public int currentStage;

    public void OnEnable()
    {
        currentStage = 0;
    }

    IEnumerator ShowFeedbackIEnumerator()
    {
        StageFeedback_Positive.SetActive(true);
        yield return new WaitForSeconds(2f);
        StageFeedback_Positive.SetActive(false);
        GoNextStage();
    }

    IEnumerator ShowFeedbackNegativeIEnumerator()
    {
        StageFeedback_Negative.SetActive(true);
        yield return new WaitForSeconds(2f);
        StageFeedback_Negative.SetActive(false);
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

    public void TriggerLose()
    {
        StartCoroutine(ShowFeedbackNegativeIEnumerator());
    }
}
