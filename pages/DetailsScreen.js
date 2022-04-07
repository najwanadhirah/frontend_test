
import React from "react";
import { StyleSheet, SafeAreaView, FlatList, View, Text, TouchableOpacity, TextInput } from "react-native";
import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase('db.db');

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
            pass_id:'',
            project: [],
            query: '',
            dataSource: [],
            dataBackup: [],
        }
    }

    componentDidMount() {
        db.transaction((tx) => {
            const sql = 'select * from Details order by id desc limit 1';
            tx.executeSql(sql, [], (tx, results) => {
              const pass_id = results.rows.item(0).details_id;
              this.setState({ pass_id: pass_id});

               fetch('https://jsonplaceholder.typicode.com/comments?postId='+this.state.pass_id)
               .then((response) => response.json()) 
               .then((responseJson) => {
                 this.setState({
                   dataSource: responseJson,
                   dataBackup: responseJson,
                   data : responseJson
                 })
               }) 
               .catch(() => {
               });  
            });
       
        });
    }

    filterList = (text) => {
        var newData = this.state.dataBackup;
        newData = this.state.dataBackup.filter((item) => {
          const itemData = `${item.name.toLowerCase()} ${item.email.toLowerCase()} ${item.body.toLowerCase()}`;
          const textData = text.toLowerCase()
          return itemData.indexOf(textData) > -1
        });
        this.setState({
          query: text,
          data: newData // after filter we are setting users to new array  
        });
      }

    renderItemComponent = (data) =>
    <View style={styles.listItem}>
        
        <TouchableOpacity style={styles.container}>

            <Text style={{fontWeight:"bold"}}> {data.item.name}</Text>
           
            <Text style={{marginTop:7, fontSize:12}}> {data.item.email} </Text>

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

          <View style={styles.SectionStyle}>
            <TextInput
              style={{ flex: 1 }}
              placeholder="Search Here"
              placeholderTextColor="#000" 
              underlineColorAndroid="transparent"
              value={this.state.query}
              onChangeText={(text) => this.filterList(text)}/>
          </View>
           
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
    marginTop:0
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
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    width:"80%",
    marginLeft:35,
    borderRadius: 5,
    margin: 1,
    marginTop: 40,
  },
 });