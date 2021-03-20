include("openHarmony.js");
include("D:/1_TRAVAIL/WIP/ALARIGGER/CODING/JS/REPOSITORIES/AL_AutoExpression/AL_AutoExpression.js");

MessageLog.trace("prototype")

function autoExpression(){

	AL_AutoExpression();
	
}

include("D:/1_TRAVAIL/WIP/ALARIGGER/CODING/JS/REPOSITORIES/AL_connectCurvePoints/AL_connectCurvePoints.js");


function connectCurvePoints(){
	AL_connectCurvePoints()
	
}


function getAttributesNameList(){
	
	var snode = selection.selectedNode(0);
	
	var attrList = node.getAttrList(snode, frame.current(),"");
	var name_list= Array();
	
	MessageLog.trace("***********************************");
	MessageLog.trace(snode);
	MessageLog.trace(node.type(snode));
	MessageLog.trace("***********************************");
	
	for (var i=0; i<attrList.length; i++){	

		var attr = attrList[i];
		var a_name = attr.keyword();
		var sub_attr = attr.getSubAttributes()
		name_list.push(a_name);

		if(sub_attr.length > 0){
			for (var j=0; j<sub_attr.length; j++){	
				attrList.push(sub_attr[j]);
				var sub_attr_name = sub_attr[j].fullKeyword()
				name_list.push(sub_attr_name);
				
				MessageLog.trace(sub_attr_name);
			}
		}
		
	}
	
	MessageLog.trace("***********************************");

	
	return name_list;
	
}



//key_word 
//type 
//search profiles


include("D:/1_TRAVAIL/WIP/ALARIGGER/CODING/JS/REPOSITORIES/AL_search_in_links/AL_search_in_links.js");


function search_in_links(){
	
	MessageLog.trace("SEARCH IN LINKS");
	
	var bounty_dude = new Bounty("PEG","DUDE")
	var bounty_drawing = new Bounty("ANYTYPE","g_1")

	var snode = selection.selectedNode(0);
	
	var bounty_list_A = [bounty_dude,bounty_drawing]
	 
	if(search_in_links_process(snode,[bounty_dude,bounty_drawing]) != false){
		
		MessageLog.trace(bounty_dude.catch_result );
		
		selection.clearSelection();
		
		for(var bb = 0 ; bb < bounty_list_A.length ; bb++){
			
			//selection.addNodeToSelection(bounty_list_A[bb].catch_result)
			
		}		
		
	}


}

include("D:/1_TRAVAIL/WIP/ALARIGGER/CODING/JS/REPOSITORIES/AL_reverse_bones/AL_reverse_bones.js");

function reverse_bones(){
	
	var bounty_uptibia = new Bounty("BendyBoneModule","UP_TIBIA")
	var bounty_upfemur = new Bounty("BendyBoneModule","UP_FEMUR")
	var bounty_downtibia = new Bounty("BendyBoneModule","DOWN_TIBIA")
	var bounty_downfemur = new Bounty("BendyBoneModule","DOWN_FEMUR")
	var bounty_tsbate = new Bounty("READ","TS_BATE")
	var bounty_footgate = new Bounty("TransformGate","FOOT_TGATE")
	
	var UP_TIBIA = ""
	var UP_FEMUR = ""
	var DOWN_TIBIA = ""
	var DOWN_FEMUR = ""
	var DOWN_FEMUR = ""
	var TS_BATE = ""
	var FOOT_TGATE = ""
	


	var snode = selection.selectedNode(0);
	
	var bounty_list_A = [bounty_uptibia,bounty_upfemur,bounty_downtibia,bounty_downfemur,bounty_tsbate,bounty_footgate]
	 
	if(search_in_links_process(snode,bounty_list_A) != false){
		
		
		
	

		UP_TIBIA = new AbstractBone(bounty_uptibia.catch_result)

		UP_FEMUR = new AbstractBone(bounty_upfemur.catch_result);
		
		DOWN_TIBIA = new AbstractBone(bounty_downtibia.catch_result)
		
		DOWN_FEMUR = new AbstractBone(bounty_downfemur.catch_result)

		TS_BATE = bounty_tsbate.catch_result;
		
		FOOT_TGATE = bounty_footgate.catch_result;
		
		var interesting_nodes = [UP_TIBIA,UP_FEMUR,DOWN_TIBIA,DOWN_FEMUR,TS_BATE]
		//                            0     1          2           3       4
		
		
		for(var bb = 0 ; bb < interesting_nodes.length ; bb++){
			
			
			if(interesting_nodes[bb].node == snode){
				
				var node_to_reselect = ""; 
				
				if(bb == 0){
					node_to_reselect = interesting_nodes[2].node
				}
				if(bb == 1){
					node_to_reselect = interesting_nodes[3].node
				}
				if(bb == 2){
					node_to_reselect = interesting_nodes[0].node
				}
				if(bb == 3){
					node_to_reselect = interesting_nodes[1].node
				}
				selection.clearSelection();
				
				selection.addNodeToSelection(node_to_reselect)
				
				break;
			}
			
		}		
		
		scene.beginUndoRedoAccum("reverse_bones"); 
		
		var STATE = get_current_sub(TS_BATE);
		
		MessageLog.trace(TS_BATE);
		
		MessageLog.trace("STATE : "+STATE);
		
		if(STATE == "UP"){
			
			change_sub(TS_BATE,"DOWN")
			node.setTextAttr(FOOT_TGATE, "TARGET_GATE", frame.current(), 0);
			add_key(FOOT_TGATE,"TARGET_GATE");
			UP_TO_DOWN()
			
			//selection.addNodeToSelection(bounty_list_A[bb].catch_result)
			
		}
		if(STATE == "DOWN"){
			
			change_sub(TS_BATE,"UP")
			node.setTextAttr(FOOT_TGATE, "TARGET_GATE", frame.current(), 1);
			add_key(FOOT_TGATE,"TARGET_GATE");
			DOWN_TO_UP()
		}
			
			
		
		
		scene.endUndoRedoAccum();  
	}	
	

	
	function UP_TO_DOWN(){

		var UT_orient = UP_TIBIA.get_orientation ()
		var UT_length = UP_TIBIA.get_length();
		
		var UT_X = UP_TIBIA.get_x()
		var UT_Y = UP_TIBIA.get_y()

		var UF_orient =  UP_FEMUR.get_orientation()
		var UF_length = -UP_FEMUR.get_length();
		
		MessageLog.trace("out");


		var DF_NOrient = (UT_orient+UF_orient)-180
		var DT_NOrient = 360-UF_orient
		
		//POSITION
		var DistanceX = UT_X
		var DistanceY = UT_Y/(4/3);

		var UT_radian = degrees_to_radians(UT_orient)
		var UF_radian = degrees_to_radians(UF_orient-180)
		
		var X1 = parseFloat(UT_length*Math.cos(UT_radian))
		var Y1 = parseFloat(UT_length*Math.sin(UT_radian))
		
		
		var RADANGLE_2  = parseFloat((UT_radian+UF_radian))

		
		var DF_nX =parseFloat((X1+(UF_length*Math.cos(RADANGLE_2))+DistanceX))
		var DF_nY =parseFloat((Y1+(UF_length*Math.sin(RADANGLE_2))+DistanceY))*(4/3)
	
		
		DOWN_FEMUR.set_new_length(UP_FEMUR.get_length());
		DOWN_FEMUR.set_new_orientation(DF_NOrient);
		DOWN_FEMUR.set_new_position({x:DF_nX,y:DF_nY});
		
		DOWN_TIBIA.set_new_length(UP_TIBIA.get_length());
		DOWN_TIBIA.set_new_orientation(DT_NOrient);
		
		DOWN_FEMUR.apply_new_values();
		DOWN_TIBIA.apply_new_values();
		UP_FEMUR.apply_new_values();
		UP_TIBIA.apply_new_values();	

		DOWN_FEMUR.add_keys_to_all();
		DOWN_TIBIA.add_keys_to_all();
		UP_FEMUR.add_keys_to_all();
		UP_TIBIA.add_keys_to_all();		
		
	}
	
	function DOWN_TO_UP(){
		
		// F to T 

		var DF_orient = DOWN_FEMUR.get_orientation()-180
		var DF_length = DOWN_FEMUR.get_length()
		
		var DF_X = DOWN_FEMUR.get_x()
		var DF_Y = DOWN_FEMUR.get_y()

		var DT_orient = DOWN_TIBIA.get_orientation()-180
		var DT_length = DOWN_TIBIA.get_length();
		
		MessageLog.trace("out");

		//ANGLES 
		var UT_NOrient = DF_orient+(DT_orient-180)
		var UF_NOrient = 180-(DT_orient);
		
		//POSITION
		var DistanceX = DF_X 
		var DistanceY = DF_Y /(4/3)

		var DF_radian = degrees_to_radians(DF_orient+180)
		var DT_radian = degrees_to_radians(DT_orient+180)
		
		var X1 = parseFloat(DF_length*Math.cos(DF_radian))
		var Y1 = parseFloat(DF_length*Math.sin(DF_radian))
		
		
		var RADANGLE_2  = (DT_radian+DF_radian)
		
		var UT_nX =(X1+(DT_length*Math.cos(RADANGLE_2))+DistanceX)
		var UT_nY =(Y1+(DT_length*Math.sin(RADANGLE_2))+DistanceY)*(4/3)
	
		
		UP_TIBIA.set_new_length(DT_length);
		UP_TIBIA.set_new_orientation(UT_NOrient);
		UP_TIBIA.set_new_position({x:UT_nX,y:UT_nY});
		
		UP_FEMUR.set_new_length(DF_length);
		UP_FEMUR.set_new_orientation(UF_NOrient);
		
		UP_FEMUR.apply_new_values();
		UP_TIBIA.apply_new_values();
		DOWN_FEMUR.apply_new_values()
		DOWN_TIBIA.apply_new_values()
		
		DOWN_FEMUR.add_keys_to_all();
		DOWN_TIBIA.add_keys_to_all();
		UP_FEMUR.add_keys_to_all();
		UP_TIBIA.add_keys_to_all();	
	}
	


}


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

// deactivate them with influance

function AbstractBone(_node){

	this.node = _node
	
	// GETTERS 
	
	this.get_orientation = function(){
		
		return parseFloat(node.getTextAttr(this.node, frame.current(), "orientation"));
	}
	
	this.get_rectified_orientation = function(){
	
		var angle = this.get_orientation();
		var unsquashed_angle = (4/3) * Math.atan(angle);
		return radians_to_degrees(unsquashed_angle);
		
	}
	
	this.get_length = function(){
		
		var length =  parseFloat(node.getTextAttr(this.node, frame.current(), "length"));
		return length;
	}	
	
	this.get_x = function(){
		MessageLog.trace("X")
		MessageLog.trace(parseFloat(node.getTextAttr(this.node, frame.current(), "offset.X")))
		return parseFloat(node.getTextAttr(this.node, frame.current(), "offset.X"));
	}	
	
	this.get_y = function(){
		
		MessageLog.trace("Y")
		MessageLog.trace(parseFloat(node.getTextAttr(this.node, frame.current(), "offset.Y")))
		return parseFloat(node.getTextAttr(this.node, frame.current(), "offset.Y"));
	}		
	
	
	// FETCH VALUES 
	
	this.orientation = this.get_orientation();
	
	this.length = this.get_length();
	
	this.position = {x:this.get_x(),y:this.get_y()};
	
	
	// for calculating 
	
	this.new_orientation = this.orientation
	
	this.new_length = this.length;
	
	this.new_position  = this.position;
	
	
	
	
	this.set_new_orientation = function(_nor){
		
		this.new_orientation = _nor

	}
	
	this.set_new_length = function(_nl){
		
		this.new_length = _nl
		
	}	
	
	this.set_new_position = function(_npos){
		
		this.new_position = _npos
	}	
	
	
	
	
	
	//the real thing : 
	
	this.apply_new_values = function(){
		
		node.setTextAttr(this.node, "length", frame.current(), this.new_length);
		node.setTextAttr(this.node, "offset.X", frame.current(), this.new_position.x);
		node.setTextAttr(this.node, "offset.Y", frame.current(), this.new_position.y);
		node.setTextAttr(this.node, "orientation", frame.current(), this.new_orientation);
		
	}
	
	this.add_keys_to_all = function(){
		
		this.add_key("length")
		this.add_key("offset.X")
		this.add_key("offset.Y")
		this.add_key("orientation")

	}
	
	
	this.add_key = function(attr){
		var _column = node.linkedColumn(this.node, attr)
		column.setKeyFrame(_column,frame.current())			
		
	}
}


function change_sub(_node,_sub_name){

	var numLayers = Timeline.numLayers; 
	var readColumn =""; 

	for(var i = 0 ; i<numLayers;i++){

		if(Timeline.layerToNode(i)==_node){

			currentColumn = Timeline.layerToColumn(i);
			if(column.type(currentColumn) == "DRAWING"){
				readColumn = Timeline.layerToColumn(i);
				break;
			}
		}
	}


	if(readColumn != ""){

		column.setEntry(readColumn,1,frame.current(),_sub_name);

	}

}

	function add_key(_node,attr){
		var _column = node.linkedColumn(_node, attr)
		column.setKeyFrame(_column,frame.current())			
		
	}

function get_current_sub(_node){
	
	var sub = false;
	
	var numLayers = Timeline.numLayers; 
	
	var readColumn=""; 

	for(var i = 0 ; i<numLayers;i++){

		if(Timeline.layerToNode(i)==_node){

			currentColumn = Timeline.layerToColumn(i);
			
			if(column.type(currentColumn) == "DRAWING"){
				
				readColumn = currentColumn
				
				break;
			}
		}
	}
	MessageLog.trace(readColumn);


	if(readColumn != ""){

		var DrawingName =column.getDrawingName(readColumn,frame.current())
	
		var sub = Extract_drawingName(DrawingName)
	
	}
	
	
		MessageLog.trace("SUB");
		MessageLog.trace(sub);
	
	return sub;
}


function Extract_drawingName(tvgname){
		
		var split0=tvgname.split('-');

		var split1=split0[1];
		
		var result = "no";

		if(split1 != "" &&typeof(split1) == "string"){
			var split2 = split1.split('.')
			var  oldTiming= split2[0];	
			result = oldTiming;
		}
		return result;
	
}





