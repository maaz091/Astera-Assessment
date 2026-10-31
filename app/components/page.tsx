import {Button,Badge,Card,Trail} from '../../src/ui';
import {ChartCard} from '../../src/chat';
export default function Page(){return <><h1>Components</h1><p>The same components used in Chat.</p><Card><h2>Actions & status</h2><Button>Primary action</Button> <Button className="secondary">Secondary</Button> <Button disabled>Unavailable</Button><p>{['Running','Succeeded','Failed','Scheduled'].map(s=><Badge key={s} status={s}/>)}</p><Trail/></Card><ChartCard query={{kind:'region',quarter:3}}/></>}
