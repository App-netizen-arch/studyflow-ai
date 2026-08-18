import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main(){
 const user=await prisma.user.upsert({where:{email:'demo-user@studyflow.local'},update:{},create:{email:'demo-user@studyflow.local'}});
 const count=await prisma.note.count({where:{userId:user.id}}); if(count>0)return;
 await prisma.note.createMany({data:[
  {userId:user.id,title:'Photosynthesis',subject:'Biology',content:'Photosynthesis is the process by which green plants convert light energy into chemical energy. It mainly occurs in chloroplasts and uses carbon dioxide and water to produce glucose and oxygen. Chlorophyll absorbs light energy. The process can be described with the overall equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.'},
  {userId:user.id,title:"Newton's Laws",subject:'Physics',content:"Newton's first law states that an object remains at rest or in uniform motion unless acted on by a net external force. The second law relates net force, mass, and acceleration: F = ma. The third law states that forces occur in equal and opposite action-reaction pairs."},
  {userId:user.id,title:'Database Normalization',subject:'Computer Science',content:'Normalization organizes relational data to reduce redundancy and improve integrity. First normal form requires atomic values. Second normal form requires 1NF plus no partial dependency on part of a composite key. Third normal form requires 2NF plus no transitive dependency on a non-key attribute.'}
 ]});
}
main().finally(()=>prisma.$disconnect());
