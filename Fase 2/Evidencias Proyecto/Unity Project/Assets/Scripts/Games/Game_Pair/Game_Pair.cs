using System.Collections.Generic;
using UnityEngine;

public class Game_Pair : MonoBehaviour
{
    public GameStager gameStager;
    public List<DragDropSlot> matchPairs;

    public void OnItemDropped()
    {
        bool hasWin = true;
        foreach (var pair in matchPairs)
        {
            if (pair.id == pair.overObject.id)
            {
                //TOY TROLLEANDO HEHE
            }
            else
            {
                hasWin = false;
            }
        }

        if (hasWin)
        {
            gameStager.TriggerWin();
        }
    }

}
