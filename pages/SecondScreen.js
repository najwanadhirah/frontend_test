
import React from "react";
import { StyleSheet, SafeAreaView, FlatList, View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from 'react-native-router-flux';
import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase('db.db');

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
            pass_id:'',
            userIdJson:'',
            data:[],
            dataTitle:'',
            dataBody:'',
            dataUser:''
        }
        this.onClickListener = this.onClickListener.bind(this);
    }

    componentDidMount() {

        db.transaction((tx) => {
            tx.executeSql('create table if not exists Details (id integer primary key not null, details_id integer, details_name text)');
          });

        db.transaction((tx) => {
            const sql = 'select * from users order by id desc limit 1';
            tx.executeSql(sql, [], (tx, results) => {
              const pass_id = results.rows.item(0).user_id;
              this.setState({ pass_id: pass_id});
              this.fetchPosts();  
            });
        });  
    }

    fetchPosts() {
        this.setState({ refreshing: true });
       fetch('https://jsonplaceholder.typicode.com/posts/'+this.state.pass_id)
       
       .then((response) => response.json())
       .then((responseJson) => {
         this.setState({
           dataSource: responseJson,
           dataBackup: responseJson,
           dataTitle : responseJson.title,
           dataBody : responseJson.body,
           dataUser : responseJson.userId,
           dataId : responseJson.id
         })
       })
       .catch(() => {
       });   
    }

    handleRefresh = () => {
        this.setState({ refreshing: false }, () => { this.fetchPosts() }); // call fetchPosts after setting the state
    }

    onClickListener = () => {

        db.transaction((tx) => {
            const sql = 'insert into Details (details_id, details_name) values (?,?)';
            tx.executeSql(sql, [this.state.dataId, this.state.dataTitle], (tx, results) => {
            });            
          });

          Actions.Details();
      }

    render() {
     return (
        <View style={styles.listItem}>
             <Text> 
                 {"\n"} 
                 {"\n"} 
                 <Text style={{fontWeight:"bold"}}> Title </Text>
                {"\n"} 
                <Text style={{marginLeft:30}}> {this.state.dataTitle} </Text>
                {"\n"} 
                {"\n"} 
                <Text style={{fontWeight:"bold"}}> Body </Text>
                {"\n"} 
                <Text style={{marginLeft:30}}> {this.state.dataBody} </Text>
                {"\n"} 

                <View>
                    <TouchableOpacity style={styles.buttonContainer}
                         onPress={() => { this.onClickListener(); }}>
                        <LinearGradient colors={['#145882', '#18387E']} style={styles.buttonContainer}>
                        <Text style={styles.ButtonText}>Details</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                 </View>
             </Text>
        </View>
       )
   }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: '#FFF'
  },
  titleStyle:{
    fontWeight:"bold",
    marginTop:60
  },
  listItem:{
    marginTop:80,
    margin:10,
    padding:10,
    backgroundColor:"#FFF",
    width:"90%",
    height:"40%",
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  },
  ButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: 'white',
    marginBottom: 15,
    paddingTop: 10,
    top: 3
  },
  buttonContainer: {
      marginTop:20,
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 5,
    marginLeft: 5,
    width: 300,
    marginTop: 10
  },
 });