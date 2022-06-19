import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import tw from 'twrnc';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [signIn, setSignIn] = useState(false)

  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  

  const [request, response, promptAysnc] = Google.useAuthRequest({
    expoClientId: '8271162453-l2jmbil5h4cs2kkcmf3atp1mgstppca6.apps.googleusercontent.com'
  })

  useEffect(() => {
    if(response?.type === 'success'){

      setAccessToken(response.authentication.accessToken);

    }
  }, [response])

  async function getUserData(){
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers: { Authorization: `Bearer ${accessToken}`}
    })

    userInfoResponse.json().then(data =>{
      setUserInfo(data)
    })

  }

  function showUserInfo(){
    if(userInfo){
      console.log(userInfo)
      return ( 
        <View style ={tw`flex-1 bg-red-300 items-center justify-center`}>
          <Image style = {tw`w-50 h-50`} source = {{uri:userInfo.picture}} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      )
    }
  }
  
  return (
    <SafeAreaView>
      <View style={tw`h-full bg-blue-300 items-center justify-center`}>
        {showUserInfo()}
        <Button title = {signIn? "Sign Out": "Sign In"} onPress = {()=>setSignIn(!signIn)}></Button>
        <Button
        title = {accessToken? "Get User Data": "Login"}
        onPress={accessToken ? getUserData : ()=>{promptAysnc({
          showInRecents: true
        })}}
        ></Button>
        <Text>Please you will work </Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}


