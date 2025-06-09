using UnityEngine;

public class Game_Paint : MonoBehaviour
{
    [Header("References")]
    public Camera cam;
    public Material paintMaterial;
    public Transform topLeftCorner;
    public Transform bottomRightCorner;
    public Transform pointIndicator;

    [Header("Canvas Settings")]
    public int textureWidth = 1024;
    public int textureHeight = 512;

    [Header("Brush Settings")]
    public int brushSize = 4;
    public Color brushColor = Color.black;
    public bool useInterpolation = true;

    private Texture2D canvasTexture;
    private Color[] colorMap;
    private float xMultiplier, yMultiplier;
    private int currentX, currentY;
    private int lastX, lastY;
    private bool wasDrawingLastFrame = false;

    void Start()
    {
        colorMap = new Color[textureWidth * textureHeight];
        canvasTexture = new Texture2D(textureWidth, textureHeight, TextureFormat.RGBA32, false);
        canvasTexture.filterMode = FilterMode.Point;

        paintMaterial.SetTexture("_BaseMap", canvasTexture);

        ResetCanvas();

        xMultiplier = textureWidth / (bottomRightCorner.localPosition.x - topLeftCorner.localPosition.x);
        yMultiplier = textureHeight / (bottomRightCorner.localPosition.y - topLeftCorner.localPosition.y);
    }

    void Update()
    {
        if (Input.GetMouseButton(0))
        {
            Debug.Log("aa");
            Ray ray = cam.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit hit, 10f))
            {
                Debug.Log("POINTED");
                pointIndicator.position = hit.point;

                currentX = (int)((pointIndicator.localPosition.x - topLeftCorner.localPosition.x) * xMultiplier);
                currentY = (int)((pointIndicator.localPosition.y - topLeftCorner.localPosition.y) * yMultiplier);

                Draw();
            }
        }
        else
        {
            wasDrawingLastFrame = false;
        }
    }

    void Draw()
    {
        if (useInterpolation && wasDrawingLastFrame && (currentX != lastX || currentY != lastY))
        {
            int dist = (int)Mathf.Sqrt((currentX - lastX) * (currentX - lastX) + (currentY - lastY) * (currentY - lastY));
            for (int i = 1; i <= dist; i++)
            {
                int interpX = (i * currentX + (dist - i) * lastX) / dist;
                int interpY = (i * currentY + (dist - i) * lastY) / dist;
                DrawBrush(interpX, interpY);
            }
        }
        else
        {
            DrawBrush(currentX, currentY);
        }

        lastX = currentX;
        lastY = currentY;
        wasDrawingLastFrame = true;

        ApplyCanvas();
    }

    void DrawBrush(int x, int y)
    {
        int minX = Mathf.Max(x - brushSize, 0);
        int maxX = Mathf.Min(x + brushSize, textureWidth - 1);
        int minY = Mathf.Max(y - brushSize, 0);
        int maxY = Mathf.Min(y + brushSize, textureHeight - 1);

        for (int px = minX; px <= maxX; px++)
        {
            for (int py = minY; py <= maxY; py++)
            {
                if ((px - x) * (px - x) + (py - y) * (py - y) <= brushSize * brushSize)
                {
                    colorMap[px * textureHeight + py] = brushColor;
                }
            }
        }
    }

    void ApplyCanvas()
    {
        canvasTexture.SetPixels(colorMap);
        canvasTexture.Apply();
    }

    public void ResetCanvas()
    {
        for (int i = 0; i < colorMap.Length; i++)
            colorMap[i] = Color.white;

        ApplyCanvas();
    }

    public void SetNewColor(Color newColor)
    {
        brushColor = newColor;
    }

    public void SaveCanvasToFile()
    {
        byte[] png = canvasTexture.EncodeToPNG();
        System.IO.File.WriteAllBytes(Application.persistentDataPath + "/drawing.png", png);
        Debug.Log("Dibujo guardado en: " + Application.persistentDataPath + "/drawing.png");
    }
}
