



// CLASS BOUNTY : USE FOR PICKING NODES AND HANDING THEM BACK INSIDE A "CATCH_RESULT" PARAMETER 


var Bounty = function(_node_type,_key_word){
	
	this.node_type = _node_type
	
	this.key_word = _key_word
	
	this.catch_result = false;
	
	this.scan = function(_snode){
		
		var snode_type = get_type(_snode);
		
		var snode_name = get_short_name(_snode);
		
		var match_key = (has_key_word(snode_name,this.key_word)|| _key_word == undefined)
		
		var match_type = (snode_type == this.node_type  || _node_type == "ANYTYPE")
		
		if(match_key && match_type){
			
			this.catch_result  = _snode;
			
			return true;
			
		}else{
			
			return false;
			
		}
		
	}

	function get_type(_node){
		
		var cnode = $.scene.getNodeByPath(_node);
		
		return cnode.type;
	}

	function get_short_name(_node){
		
		var cnode = $.scene.getNodeByPath(_node);
		
		return cnode.name;
	}

	function has_key_word(_string,_key_word){

		var result = _string.search(_key_word)
		
		return result != -1
		
	}

	
	
}

function search_in_links_process(_start_node,_bounty_list){
	
	//start node: a simple node path string
	//bounty_list :should be a reference to an bounty object array
	
	start_node = _start_node != undefined ? _start_node : false;
	
	if(start_node != false){
		
		var bounty_list = _bounty_list != undefined ? _bounty_list : false;
		 
		 var search_pool = [start_node]
		 
		 var nodes_left_to_search = 0
		 
		if(bounty_list != false){
			
			nodes_left_to_search = bounty_list.length;
			
		}
		 
		 for(var n=0 ; n < search_pool.length ; n++){
			 
			var current_node = search_pool[n];

			var inputs = get_input_nodes(current_node);
			
			var outputs = get_output_nodes(current_node);
			
			var near_nodes = inputs.concat(outputs);
			
			if(bounty_list != false){
				
				for (var b = 0 ; b < bounty_list.length ; b++){
					
					var current_bounty = bounty_list[b];
					
					if(current_bounty.catch_result  == false){
						
						var match = current_bounty.scan(current_node);
						
						if(match == true){
							

							nodes_left_to_search--;
							
						}
						
					}
					
				}
				
			}
				
			 if(nodes_left_to_search > 0){
				 
				for(var i= 0 ; i < near_nodes.length ; i++){
					
					if(search_pool.indexOf(near_nodes[i]) == -1){	
					
						search_pool.push(near_nodes[i]);
						
					}
					
				}

			}
		 
		 }
	
		if(nodes_left_to_search > 0){
			
			return false;
			
		}
	
	}


	function get_input_nodes(_node){
		
		var cnode = $.scene.getNodeByPath(_node);
		
		return cnode.linkedInNodes;
			
		
		
	}


	function get_output_nodes(_node){
		
		
		var cnode = $.scene.getNodeByPath(_node);
		
		return cnode.linkedOutNodes;
			
			
		
		
		
	}
		 
}
