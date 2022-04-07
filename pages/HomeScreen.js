
import React from "react";
import { StyleSheet, SafeAreaView, FlatList, View, Text, TouchableOpacity } from "react-native";
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
        }
    }

    componentDidMount() {
        db.transaction((tx) => {
            tx.executeSql('create table if not exists users (id integer primary key not null, user_id integer, user_name text)');
          });
          this.fetchPosts();
    }

    fetchPosts() {
        this.setState({ refreshing: true });
       fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(resJson => {
                this.setState({ data: resJson });
                this.setState({ post_ID: resJson.id });
                this.setState({ refreshing: false });
           }).catch(e => console.log(e));
    }

    renderItemComponent = (data) =>
    <View style={styles.listItem}>
        
        <TouchableOpacity 
            style={styles.container}
                onPress={() => {
                  db.transaction((tx) => {
                    const sql = 'insert into users (user_id, user_name) values (?,?)';
                    tx.executeSql(sql, [data.item.id, data.item.title], (tx, results) => {
                      Actions.Second();
                    });
                  });
                }}>
            <Text style={{fontWeight:"bold"}}> {data.item.title}</Text>
            <Text style={{marginTop:7, fontSize:12}}> {data.item.body} </Text>
        </TouchableOpacity>
    </View>

    renderSeparator = () => 
    {
        return (
        <View style={{ height: 1, width: "86%", backgroundColor: "#CED0CE",marginLeft: "14%"}}/>
        );
    };

    handleRefresh = () => {
        this.setState({ refreshing: false }, () => { this.fetchPosts() }); // call fetchPosts after setting the state
    }

    render() {
     return (
        <SafeAreaView>
         <FlatList
            data={this.state.data}
            renderItem={item => this.renderItemComponent(item)}
           keyExtractor={item => item.id.toString()}
           ItemSeparatorComponent={this.ItemSeparator}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}/>
       </SafeAreaView>
       )
   }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: '#FFF',
    marginTop:10
  },
  listItem:{
    margin:10,
    padding:10,
    backgroundColor:"#FFF",
    width:"80%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  }
 });