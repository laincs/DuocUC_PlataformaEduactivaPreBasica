using System;

[Serializable]
public struct UserData
{
    public string token;
    public int userId;
    public string name;
    public string userType;
    public string grade;
    public string location;
}

[System.Serializable]
public struct Session
{
    public int id;
    public string game_id;
    public int grade_id;
    public int location_id;
    public string status;
    public string grade_name;
    public string location_name;
}


[System.Serializable]
public class SessionResponse
{
    public bool success;
    public Session[] data;
    public string message;
    public string error;
}


[Serializable]
public class SessionUser
{
    public string user_id;
    public string name;
    public string email;
    public string status;
    public string joined_at;
    public string left_at;
}

[Serializable]
public class SessionUsersResponse
{
    public bool success;
    public SessionUser[] data;
}

[System.Serializable]
public class StatusResponse
{
    public bool success;
    public StatusData data;
}

[System.Serializable]
public class StatusData
{
    public string status;
}

