using TMPro;
using UnityEngine;

public class SessionUserStudent : MonoBehaviour
{
    public TMP_Text TMP_name;
    public TMP_Text TMP_email;
    public TMP_Text TMP_status;
    public TMP_Text TMP_joined_at;

    public void UpdateTMP(string name, string email, string status, string joined)
    {
        TMP_name.text = name;
        TMP_email.text = email;
        TMP_status.text = status;
        TMP_joined_at.text = joined;
    }
}
