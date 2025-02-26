''' This class is user built class to send the response'''
import json
class success:
    def __init__(self,status,payload):
        self.success=True
        self.status=status
        self.payload=payload # it can be json or plain
    
    def to_dict(self):
        return {
            "status":self.status,
            "success":self.success,
            "payload":self.payload
        }
    def stringify(self):
        return json.dumps(self.to_dict())
    
    def __str__(self):
        return f"success:{self.status}, payload:{self.payload}"

class failure:
    def __init__(self,status,error):
        self.success=False
        self.status=status
        self.error=error # it can be json or plain
    
    def to_dict(self):
        return {
            "status":self.status,
            "success":self.success,
            "error":self.error
        }
    def stringify(self):
        return json.dumps(self.to_dict())
    
    def __str__(self):
        return f"success:{self.status}, Error:{self.error}"