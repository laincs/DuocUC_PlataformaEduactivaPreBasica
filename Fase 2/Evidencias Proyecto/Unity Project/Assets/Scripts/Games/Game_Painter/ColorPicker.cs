using UnityEngine;
using UnityEngine.UI;

public class ColorPicker : MonoBehaviour
{
    public Game_Paint game_Paint;
    public Image targetImage;
    public void SetNewColor()
    {
        game_Paint.SetNewColor(targetImage.color);
    }
}
