using UnityEngine;
using UnityEngine.EventSystems;

public class DragDropSlot : MonoBehaviour, IDropHandler
{
    public string id;
    public DragDrop overObject;
    public Game_Pair game_Pair;
    public void OnDrop(PointerEventData eventData)
    {
        if (eventData.pointerDrag != null)
        {
            eventData.pointerDrag.GetComponent<RectTransform>().anchoredPosition = GetComponent<RectTransform>().anchoredPosition;
            overObject = eventData.pointerDrag.GetComponent<DragDrop>();

            game_Pair.OnItemDropped();
        }
    }
}
