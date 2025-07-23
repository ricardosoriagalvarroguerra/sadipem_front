import { FaArrowUp } from 'react-icons/fa';
import fonpilogo from './assets/fonpilogo.png';
import { useEffect, useRef, useState } from 'react';

// Datos de clusters visualizados con PCA (completo, según el usuario)
const CLUSTERS_DATA = [
  {"PCA1": -0.6267383560042523, "PCA2": 0.42477155073838746, "cluster": 1, "nombre_acreedor": "Banco Regional de Desenvolvimento do Extremo Sul", "sector": "Urban development", "tiempo_prestamo": 22.00684462696783, "tipo_ente": "Município", "valor_usd": 454919.4251023139},
  {"PCA1": -0.8192779757853833, "PCA2": 0.7012183139110065, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 21.71115674195756, "tipo_ente": "Município", "valor_usd": 3505710.911839307},
  {"PCA1": -0.1514567018099446, "PCA2": -1.5141247814332661, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Environmental policy and administrative management", "tiempo_prestamo": 16.0, "tipo_ente": "Município", "valor_usd": 50000000.0},
  {"PCA1": -0.9233740985712625, "PCA2": 0.9654209264770248, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 22.26967830253251, "tipo_ente": "Município", "valor_usd": 1737703.889836003},
  {"PCA1": -1.0653215830696374, "PCA2": 0.05888223885997257, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Urban development", "tiempo_prestamo": 19.53730321697467, "tipo_ente": "Município", "valor_usd": 3027793.817335945},
  {"PCA1": -1.0771214291847047, "PCA2": 0.39074137485962424, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.0, "tipo_ente": "Município", "valor_usd": 4822579.826387126},
  {"PCA1": -0.9383627701790844, "PCA2": 0.49077263095801904, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 21.02121834360027, "tipo_ente": "Município", "valor_usd": 821284.2291815254},
  {"PCA1": -0.9470980006551615, "PCA2": 0.4741143970454717, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 20.94455852156057, "tipo_ente": "Município", "valor_usd": 821284.2291815254},
  {"PCA1": -0.9383627701790845, "PCA2": 0.4907726309580189, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 21.02121834360027, "tipo_ente": "Município", "valor_usd": 821284.2291815254},
  {"PCA1": -0.9816245856527137, "PCA2": -1.5410430820133212, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Urban development", "tiempo_prestamo": 14.91854893908282, "tipo_ente": "Município", "valor_usd": 22000000.0},
  {"PCA1": -0.9981477330990678, "PCA2": 0.8163390905431406, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.60985626283368, "tipo_ente": "Município", "valor_usd": 220346.0837231618},
  {"PCA1": -0.9990385707151385, "PCA2": 0.816778217834263, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.60985626283368, "tipo_ente": "Município", "valor_usd": 176297.4811083123},
  {"PCA1": 0.14281945744173544, "PCA2": -0.26929594830134296, "cluster": 0, "nombre_acreedor": "Agência Francesa de Desenvolvimento", "sector": "Other", "tiempo_prestamo": 20.18617385352498, "tipo_ente": "Município", "valor_usd": 44377197.774},
  {"PCA1": 2.136493931329681, "PCA2": -0.0007742264520427387, "cluster": 2, "nombre_acreedor": "BID", "sector": "Urban development", "tiempo_prestamo": 24.71457905544148, "tipo_ente": "Município", "valor_usd": 106700000.0},
  {"PCA1": 0.4415673432302513, "PCA2": -1.414998164371358, "cluster": 0, "nombre_acreedor": "New Development Bank", "sector": "Urban development", "tiempo_prestamo": 17.20739219712526, "tipo_ente": "Município", "valor_usd": 75000000.0},
  {"PCA1": 0.3699620385574027, "PCA2": -0.9726749009104971, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 18.76522929500342, "tipo_ente": "Município", "valor_usd": 70000000.0},
  {"PCA1": -0.5408417465504658, "PCA2": 0.20637243066505462, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Sanitation - large systems", "tiempo_prestamo": 20.99931553730321, "tipo_ente": "Município", "valor_usd": 21019960.27298851},
  {"PCA1": -1.3975878242297202, "PCA2": -0.7384677893307067, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Sanitation - large systems", "tiempo_prestamo": 16.0, "tipo_ente": "Município", "valor_usd": 6824712.64367816},
  {"PCA1": -0.22097706079813462, "PCA2": -0.9697009888104969, "cluster": 0, "nombre_acreedor": "New Development Bank", "sector": "Urban development", "tiempo_prestamo": 17.99863107460643, "tipo_ente": "Município", "valor_usd": 40000000.0},
  {"PCA1": -1.0939212024206282, "PCA2": -1.4639749887866969, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Urban development", "tiempo_prestamo": 14.99794661190965, "tipo_ente": "Município", "valor_usd": 16000000.0},
  {"PCA1": -1.0845731427380045, "PCA2": 0.721003639687678, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.08418891170432, "tipo_ente": "Município", "valor_usd": 504556.4226306602},
  {"PCA1": -1.0908145615791098, "PCA2": 0.700552586901452, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.99931553730321, "tipo_ente": "Município", "valor_usd": 616004.4824859045},
  {"PCA1": -0.5546681257467837, "PCA2": 1.2578479817676267, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 24.03285420944558, "tipo_ente": "Município", "valor_usd": 927720.2578628638},
  {"PCA1": -0.9645349297961274, "PCA2": 0.7858024351566879, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.53867214236824, "tipo_ente": "Município", "valor_usd": 3821163.808825924},
  {"PCA1": -1.2403343162126863, "PCA2": 0.4305940570956757, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 19.74264202600958, "tipo_ente": "Município", "valor_usd": 303287.9712478005},
  {"PCA1": -0.8887153625039953, "PCA2": 0.2570710251656821, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 20.14784394250513, "tipo_ente": "Município", "valor_usd": 10520999.915832},
  {"PCA1": -1.1130193483126651, "PCA2": 0.6691384919063672, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.84325804243669, "tipo_ente": "Município", "valor_usd": 455474.8585077107},
  {"PCA1": 0.20885974988308373, "PCA2": -1.8271771363643177, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 16.0, "tipo_ente": "Município", "valor_usd": 70000000.0},
  {"PCA1": -0.49808939415911985, "PCA2": -1.513177755401785, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Urban development", "tiempo_prestamo": 15.71526351813826, "tipo_ente": "Município", "valor_usd": 40000000.0},
  {"PCA1": -0.022099679481393318, "PCA2": -1.76166904752197, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 16.0, "tipo_ente": "Município", "valor_usd": 60000000.0},
  {"PCA1": -1.0240583478447736, "PCA2": 0.6411971395588909, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.91444216290212, "tipo_ente": "Município", "valor_usd": 3503035.964502569},
  {"PCA1": 1.201070398294912, "PCA2": 0.9242462498951582, "cluster": 2, "nombre_acreedor": "BID", "sector": "Medical services", "tiempo_prestamo": 26.06433949349761, "tipo_ente": "Município", "valor_usd": 56000000.0},
  {"PCA1": 0.535030206149848, "PCA2": -1.5149221346675215, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Other", "tiempo_prestamo": 17.00205338809035, "tipo_ente": "Município", "valor_usd": 82500000.0},
  {"PCA1": 0.3111214497023939, "PCA2": 0.7743115116266109, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Sanitation - large systems", "tiempo_prestamo": 24.32580424366872, "tipo_ente": "Município", "valor_usd": 44441673.04968016},
  {"PCA1": -1.1245062233364498, "PCA2": -0.9230055726153679, "cluster": 0, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Medical services", "tiempo_prestamo": 15.8384668035592, "tipo_ente": "Município", "valor_usd": 9395792.98575291},
  {"PCA1": -0.4981493296070929, "PCA2": -1.6805385970847402, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Sanitation - large systems", "tiempo_prestamo": 14.65571526351814, "tipo_ente": "Município", "valor_usd": 50000000.0},
  {"PCA1": -1.0673645179361992, "PCA2": 0.6810746275132682, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.96919917864476, "tipo_ente": "Município", "valor_usd": 2003345.759028195},
  {"PCA1": -0.7972391868138241, "PCA2": -1.5527527187881631, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Other", "tiempo_prestamo": 14.34633812457221, "tipo_ente": "Município", "valor_usd": 34000000.0},
  {"PCA1": -0.7099189003960531, "PCA2": 0.7000592762779981, "cluster": 1, "nombre_acreedor": "Banco Regional de Desenvolvimento do Extremo Sul", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 22.03696098562628, "tipo_ente": "Município", "valor_usd": 2366412.654815394},
  {"PCA1": -1.3112082311857907, "PCA2": -0.37177124646009335, "cluster": 1, "nombre_acreedor": "Banco Regional de Desenvolvimento do Extremo Sul", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 17.03490759753593, "tipo_ente": "Município", "valor_usd": 759836.4355514193},
  {"PCA1": -0.14692183856216887, "PCA2": -1.5432693232568027, "cluster": 0, "nombre_acreedor": "CAF", "sector": "General infrastructure", "tiempo_prestamo": 16.0, "tipo_ente": "Município", "valor_usd": 54900000.0},
  {"PCA1": -0.7528881410028843, "PCA2": 0.8374767203054092, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Housing policy and administrative management", "tiempo_prestamo": 22.4476386036961, "tipo_ente": "Município", "valor_usd": 675179.2203665825},
  {"PCA1": -1.1370968766148808, "PCA2": -0.854664441997706, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Other", "tiempo_prestamo": 16.23545516769336, "tipo_ente": "Município", "valor_usd": 8136199.9877957},
  {"PCA1": 0.1484898946336745, "PCA2": 2.2560675081500166, "cluster": 1, "nombre_acreedor": "Banco do Brasil S/A", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 29.00205338809035, "tipo_ente": "Município", "valor_usd": 747359.102244389},
  {"PCA1": -0.7785457320905228, "PCA2": 0.7502478741236978, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 21.95756331279945, "tipo_ente": "Município", "valor_usd": 2722885.800178811},
  {"PCA1": 0.8491199986445067, "PCA2": 0.8086230895997936, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.39425051334702, "tipo_ente": "Estado", "valor_usd": 35000000.0},
  {"PCA1": -0.00046296132953847947, "PCA2": -1.457805252789395, "cluster": 0, "nombre_acreedor": "BIRF", "sector": "Rural development", "tiempo_prestamo": 15.2498288843258, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": 1.0723568797302205, "PCA2": 0.6425073598203237, "cluster": 2, "nombre_acreedor": "BID", "sector": "Medical services", "tiempo_prestamo": 24.39972621492129, "tipo_ente": "Estado", "valor_usd": 45197310.0},
  {"PCA1": 2.084661706343851, "PCA2": -1.2147517985670206, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Water supply - large systems", "tiempo_prestamo": 19.95619438740589, "tipo_ente": "Estado", "valor_usd": 126886000.0},
  {"PCA1": 1.0390682413125176, "PCA2": 0.946642044826609, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 25.25119780971937, "tipo_ente": "Estado", "valor_usd": 38412000.0},
  {"PCA1": -0.002889584116261436, "PCA2": -0.2117133510129413, "cluster": 0, "nombre_acreedor": "Agência Francesa de Desenvolvimento", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 19.59479808350445, "tipo_ente": "Estado", "valor_usd": 34577400.0},
  {"PCA1": 0.8999432534329009, "PCA2": 0.7886019789459904, "cluster": 2, "nombre_acreedor": "BID", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 24.62422997946612, "tipo_ente": "Estado", "valor_usd": 37000000.0},
  {"PCA1": 1.1012081226471704, "PCA2": 0.8256627605907232, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.72826830937714, "tipo_ente": "Estado", "valor_usd": 44935000.0},
  {"PCA1": 1.8903173079698314, "PCA2": -0.011792310316333262, "cluster": 2, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 22.88021902806297, "tipo_ente": "Estado", "valor_usd": 100000000.0},
  {"PCA1": -0.5935983792822643, "PCA2": -0.4540642031336305, "cluster": 0, "nombre_acreedor": "Fundo Internacional de Desenvolvimento Agrícola", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 17.46475017111567, "tipo_ente": "Estado", "valor_usd": 18000000.0},
  {"PCA1": 1.4260557719201195, "PCA2": 1.6907207892091627, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 28.68993839835729, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": 1.5449739435535226, "PCA2": 1.5742019217000147, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Social protection and welfare services policy, planning and administration", "tiempo_prestamo": 28.85420944558522, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": -0.47931548905904625, "PCA2": 0.5525714441409522, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.98562628336756, "tipo_ente": "Estado", "valor_usd": 16078619.8397855},
  {"PCA1": 1.292907510308731, "PCA2": 0.5796794728932158, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.35318275154004, "tipo_ente": "Estado", "valor_usd": 60000000.0},
  {"PCA1": 0.027274018057464405, "PCA2": -0.8377072568669087, "cluster": 0, "nombre_acreedor": "BIRF", "sector": "Other", "tiempo_prestamo": 17.33607118412047, "tipo_ente": "Estado", "valor_usd": 40000000.0},
  {"PCA1": 0.04960121306440582, "PCA2": -0.6847476334087264, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Sanitation - large systems", "tiempo_prestamo": 18.91581108829569, "tipo_ente": "Estado", "valor_usd": 39000000.0},
  {"PCA1": -1.5016108761549292, "PCA2": -0.4498969995975634, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 16.26009582477755, "tipo_ente": "Município", "valor_usd": 1371832.385167018},
  {"PCA1": -1.1962376157098393, "PCA2": -0.010014151741596953, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Water supply - large systems", "tiempo_prestamo": 19.0280629705681, "tipo_ente": "Município", "valor_usd": 550300.493362207},
  {"PCA1": -1.1025979144362363, "PCA2": 0.6550167374306645, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.8104038329911, "tipo_ente": "Município", "valor_usd": 1155886.504112523},
  {"PCA1": -0.6131395318956109, "PCA2": 1.5062999665772894, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 24.82683093771389, "tipo_ente": "Município", "valor_usd": 1132159.825613628},
  {"PCA1": 0.8882132202761489, "PCA2": 0.8244765967133918, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.56947296372348, "tipo_ente": "Estado", "valor_usd": 35100000.0},
  {"PCA1": 0.04814416742738625, "PCA2": -1.6181470459016598, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 16.0, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": 0.017486048376399735, "PCA2": -1.279790999835775, "cluster": 0, "nombre_acreedor": "New Development Bank", "sector": "Other", "tiempo_prestamo": 16.02464065708419, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": 0.344217105693502, "PCA2": -1.66871747301999, "cluster": 0, "nombre_acreedor": "Banco de Brasília S/A", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 14.9596167008898, "tipo_ente": "Estado", "valor_usd": 78089920.54350585},
  {"PCA1": 2.2315837308433584, "PCA2": 0.19800038483578986, "cluster": 2, "nombre_acreedor": "BID", "sector": "Medical services", "tiempo_prestamo": 24.90075290896646, "tipo_ente": "Estado", "valor_usd": 100000000.0},
  {"PCA1": -0.8079196605112013, "PCA2": 1.027704066964754, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 23.01163586584531, "tipo_ente": "Município", "valor_usd": 1690617.07523246},
  {"PCA1": -0.9477281479839534, "PCA2": 0.25894879577741664, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 19.99726214921287, "tipo_ente": "Município", "valor_usd": 4657562.697959396},
  {"PCA1": -0.5626940578057915, "PCA2": 0.20959779308694412, "cluster": 1, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 20.0, "tipo_ente": "Município", "valor_usd": 358694.7610068049},
  {"PCA1": 0.06009882732557641, "PCA2": -1.5979236300919, "cluster": 0, "nombre_acreedor": "Banco Santander (Brasil) S.A.", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 14.99520876112252, "tipo_ente": "Estado", "valor_usd": 66046708.23206171},
  {"PCA1": 1.7929945041840816, "PCA2": 0.3872338336348426, "cluster": 2, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 24.6488706365503, "tipo_ente": "Estado", "valor_usd": 87120000.0},
  {"PCA1": 1.74120788175182, "PCA2": 0.31017710767388695, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.48186173853525, "tipo_ente": "Estado", "valor_usd": 79866302.0},
  {"PCA1": 3.445653465565665, "PCA2": -0.5345004020584448, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.46543463381246, "tipo_ente": "Estado", "valor_usd": 164237344.0},
  {"PCA1": -0.6285363285755261, "PCA2": 1.0350136168962647, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 23.06639288158796, "tipo_ente": "Município", "valor_usd": 9314951.83},
  {"PCA1": -0.5711354299689031, "PCA2": 1.2290908760929347, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 24.09582477754962, "tipo_ente": "Município", "valor_usd": 507193.4109425418},
  {"PCA1": 1.4442287626929367, "PCA2": 0.23020131812733158, "cluster": 2, "nombre_acreedor": "BID", "sector": "Urban development", "tiempo_prestamo": 24.35318275154004, "tipo_ente": "Município", "valor_usd": 75200000.0},
  {"PCA1": -0.8165745035838334, "PCA2": 0.5017912618924208, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Housing policy and administrative management", "tiempo_prestamo": 21.14715947980835, "tipo_ente": "Município", "valor_usd": 5547136.894185627},
  {"PCA1": 1.5226968874915414, "PCA2": 0.23213870903043907, "cluster": 2, "nombre_acreedor": "New Development Bank", "sector": "Urban development", "tiempo_prestamo": 25.22108145106092, "tipo_ente": "Município", "valor_usd": 84000000.0},
  {"PCA1": -1.3161467090376233, "PCA2": -0.8098432688392042, "cluster": 0, "nombre_acreedor": "Banco de Desenvolvimento de Minas Gerais S/A", "sector": "Other", "tiempo_prestamo": 15.67693360711841, "tipo_ente": "Município", "valor_usd": 177720.3817712203},
  {"PCA1": 0.49716656449153135, "PCA2": -2.0567120775211767, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 15.50171115674196, "tipo_ente": "Município", "valor_usd": 83250000.0},
  {"PCA1": -0.5521813348350153, "PCA2": 1.0025744559673597, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 23.02532511978097, "tipo_ente": "Município", "valor_usd": 9025503.49415921},
  {"PCA1": 1.858556306249579, "PCA2": 1.300860086121254, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Other", "tiempo_prestamo": 28.77754962354552, "tipo_ente": "Município", "valor_usd": 73300000.0},
  {"PCA1": 1.827307993373561, "PCA2": -2.62570950210059, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Sanitation - large systems", "tiempo_prestamo": 15.50171115674196, "tipo_ente": "Município", "valor_usd": 150000000.0},
  {"PCA1": 0.142113058080608, "PCA2": -0.13228507975407897, "cluster": 0, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Water supply - large systems", "tiempo_prestamo": 21.04585900068446, "tipo_ente": "Município", "valor_usd": 38322401.31412286},
  {"PCA1": -0.23905732260264892, "PCA2": -1.566596470694967, "cluster": 0, "nombre_acreedor": "Banco Santander (Brasil) S.A.", "sector": "Medical services", "tiempo_prestamo": 15.01984941820671, "tipo_ente": "Município", "valor_usd": 51968299.33740418},
  {"PCA1": -1.2047189537134135, "PCA2": 0.02969805234444235, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 18.29158110882957, "tipo_ente": "Município", "valor_usd": 3431293.395769417},
  {"PCA1": 1.1211556093072728, "PCA2": 0.8026120007176502, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.87063655030801, "tipo_ente": "Estado", "valor_usd": 47700000.0},
  {"PCA1": 0.4246673644486518, "PCA2": 0.7101836214164378, "cluster": 2, "nombre_acreedor": "BID", "sector": "Urban development", "tiempo_prestamo": 24.58590006844627, "tipo_ente": "Município", "valor_usd": 25000000.0},
  {"PCA1": -0.032893907552519065, "PCA2": -1.1227322119683092, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Water supply - large systems", "tiempo_prestamo": 18.00136892539357, "tipo_ente": "Município", "valor_usd": 50000000.0},
  {"PCA1": -0.5426931087175056, "PCA2": 1.1885484928227266, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 24.0, "tipo_ente": "Município", "valor_usd": 3640067.613046701},
  {"PCA1": -1.1729739776385615, "PCA2": 0.46453079974451034, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.0, "tipo_ente": "Município", "valor_usd": 1291956.280199478},
  {"PCA1": -1.0060098540564169, "PCA2": 0.8084931413991213, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.54688569472964, "tipo_ente": "Município", "valor_usd": 1724105.620209516},
  {"PCA1": 0.08337232313424352, "PCA2": -0.8884602358171871, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Other", "tiempo_prestamo": 18.40930869267625, "tipo_ente": "Município", "valor_usd": 46967257.11218464},
  {"PCA1": -0.9726229898912256, "PCA2": 0.7766297514161468, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.48939082819986, "tipo_ente": "Município", "valor_usd": 3757044.458359424},
  {"PCA1": -1.1068116149705738, "PCA2": 0.685976538243139, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.91718001368925, "tipo_ente": "Município", "valor_usd": 287786.1408617541},
  {"PCA1": 1.891408077000144, "PCA2": 0.02267527315216761, "cluster": 2, "nombre_acreedor": "BID", "sector": "Housing policy and administrative management", "tiempo_prestamo": 23.98631074606434, "tipo_ente": "Município", "valor_usd": 100000000.0},
  {"PCA1": 0.21152608573539325, "PCA2": -0.5633873851527489, "cluster": 0, "nombre_acreedor": "Agência Francesa de Desenvolvimento", "sector": "Urban development", "tiempo_prestamo": 19.91786447638604, "tipo_ente": "Município", "valor_usd": 48543088.8},
  {"PCA1": -1.0241537022698441, "PCA2": 0.6569529393843109, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.90896646132786, "tipo_ente": "Município", "valor_usd": 627291.6460863868},
  {"PCA1": -0.7609756741670187, "PCA2": -1.3343992069409871, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Water supply - large systems", "tiempo_prestamo": 15.75633127994524, "tipo_ente": "Município", "valor_usd": 30000000.0},
  {"PCA1": 0.41478639149991026, "PCA2": -1.2524380421171533, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Sanitation - large systems", "tiempo_prestamo": 18.33264887063655, "tipo_ente": "Município", "valor_usd": 69439000.0},
  {"PCA1": 1.318372802749032, "PCA2": 0.39484123686401473, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.16974674880219, "tipo_ente": "Município", "valor_usd": 70000000.0},
  {"PCA1": 1.975308682201076, "PCA2": -1.9385206123837975, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 17.96030116358659, "tipo_ente": "Estado", "valor_usd": 136230000.0},
  {"PCA1": -0.030439022514898884, "PCA2": -0.6294791345923029, "cluster": 0, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 17.46748802190281, "tipo_ente": "Estado", "valor_usd": 36000000.0},
  {"PCA1": -0.8867296245754751, "PCA2": 0.5435298702488547, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 20.95003422313484, "tipo_ente": "Município", "valor_usd": 1556991.325197209},
  {"PCA1": -0.5010765075042559, "PCA2": -1.7213858232035046, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 14.99794661190965, "tipo_ente": "Município", "valor_usd": 42000000.0},
  {"PCA1": -0.5888483555592153, "PCA2": 0.1503793095093015, "cluster": 1, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Other", "tiempo_prestamo": 20.52840520191649, "tipo_ente": "Município", "valor_usd": 9115686.34672756},
  {"PCA1": -0.016096035113076022, "PCA2": -1.1306350307109392, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Sanitation - large systems", "tiempo_prestamo": 18.00136892539357, "tipo_ente": "Município", "valor_usd": 50000000.0},
  {"PCA1": -0.8412049374763227, "PCA2": 0.1979844655979042, "cluster": 1, "nombre_acreedor": "Banco Regional de Desenvolvimento do Extremo Sul", "sector": "Other", "tiempo_prestamo": 20.17248459958932, "tipo_ente": "Município", "valor_usd": 745809.7453476985},
  {"PCA1": -0.9067338665957003, "PCA2": 0.6365800965314742, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 21.50034223134839, "tipo_ente": "Município", "valor_usd": 189476.6314364163},
  {"PCA1": -1.0483839480572923, "PCA2": 0.6803963958772973, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.99931553730321, "tipo_ente": "Município", "valor_usd": 893849.2616054066},
  {"PCA1": -0.9443319024700285, "PCA2": 0.9121213549277007, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 22.03422313483915, "tipo_ente": "Município", "valor_usd": 207853.0963078726},
  {"PCA1": -1.0022170989631183, "PCA2": 0.7841726842668755, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.46201232032854, "tipo_ente": "Município", "valor_usd": 569654.4426751592},
  {"PCA1": -0.7187875354062214, "PCA2": 0.7343797547394041, "cluster": 1, "nombre_acreedor": "Banco Regional de Desenvolvimento do Extremo Sul", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 22.14647501711157, "tipo_ente": "Município", "valor_usd": 1310856.513646016},
  {"PCA1": -0.9732218033087296, "PCA2": 0.27922467564844994, "cluster": 1, "nombre_acreedor": "Banco Regional de Desenvolvimento do Extremo Sul", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.02464065708419, "tipo_ente": "Município", "valor_usd": 626946.5679731424},
  {"PCA1": -0.11180315760929527, "PCA2": -1.9465374250525374, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 14.96509240246407, "tipo_ente": "Município", "valor_usd": 60870000.0},
  {"PCA1": -1.2383649631458646, "PCA2": -0.10405346026669494, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 18.10814510609172, "tipo_ente": "Município", "valor_usd": 1874949.050297546},
  {"PCA1": 0.5895524554687677, "PCA2": 1.0652010775797325, "cluster": 2, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 24.99931553730321, "tipo_ente": "Município", "valor_usd": 31784500.0},
  {"PCA1": 1.0738933778855901, "PCA2": 0.6505211291907591, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.21629021218343, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": -1.1579287469738686, "PCA2": 0.298029217283969, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 19.71252566735113, "tipo_ente": "Município", "valor_usd": 2972155.59495255},
  {"PCA1": 0.3614697993412032, "PCA2": -2.0432664810959174, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 15.419575633128, "tipo_ente": "Município", "valor_usd": 80000000.0},
  {"PCA1": -0.7917241878865897, "PCA2": -1.4038775272192328, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Urban development", "tiempo_prestamo": 15.45516769336071, "tipo_ente": "Município", "valor_usd": 30000000.0},
  {"PCA1": 3.034238015375585, "PCA2": 0.9517169396688188, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Urban development", "tiempo_prestamo": 30.35181382614648, "tipo_ente": "Município", "valor_usd": 125000000.0},
  {"PCA1": 1.334251603863745, "PCA2": 0.4738504611846147, "cluster": 2, "nombre_acreedor": "BID", "sector": "Sanitation - large systems", "tiempo_prestamo": 24.80219028062971, "tipo_ente": "Município", "valor_usd": 67500000.0},
  {"PCA1": 0.09312843325807217, "PCA2": -1.6182414762289608, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Urban development", "tiempo_prestamo": 16.49007529089664, "tipo_ente": "Município", "valor_usd": 60700000.0},
  {"PCA1": 2.8261523465347675, "PCA2": 0.5548940103949466, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Urban development", "tiempo_prestamo": 28.52566735112936, "tipo_ente": "Município", "valor_usd": 125000000.0},
  {"PCA1": -0.6182506302338545, "PCA2": 0.7076172468585692, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 22.10266940451745, "tipo_ente": "Município", "valor_usd": 9341146.626455324},
  {"PCA1": -0.9347954849916311, "PCA2": 0.2167601028202674, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 19.73716632443532, "tipo_ente": "Município", "valor_usd": 7017141.984438951},
  {"PCA1": -0.10854749157562231, "PCA2": -0.3918448646328586, "cluster": 0, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Urban development", "tiempo_prestamo": 20.02737850787132, "tipo_ente": "Município", "valor_usd": 33874569.06579425},
  {"PCA1": 1.4488872307494525, "PCA2": -1.151093261093482, "cluster": 0, "nombre_acreedor": "BID", "sector": "Urban development", "tiempo_prestamo": 19.33744010951403, "tipo_ente": "Município", "valor_usd": 104000000.0},
  {"PCA1": -0.94360689229611, "PCA2": -1.3041874225525443, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Other", "tiempo_prestamo": 14.94045174537988, "tipo_ente": "Município", "valor_usd": 25000000.0},
  {"PCA1": -1.2327930176459625, "PCA2": 0.014827450994190458, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 18.4558521560575, "tipo_ente": "Município", "valor_usd": 1400302.368006868},
  {"PCA1": -0.8655394088320862, "PCA2": 0.8655257183620318, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.95756331279945, "tipo_ente": "Município", "valor_usd": 2562066.050062771},
  {"PCA1": 1.705848887658979, "PCA2": 0.5648073088197597, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.99383983572895, "tipo_ente": "Estado", "valor_usd": 70000000.0},
  {"PCA1": 0.4749489448849849, "PCA2": -1.7226744092770117, "cluster": 0, "nombre_acreedor": "Caixa", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 14.92128678986995, "tipo_ente": "Estado", "valor_usd": 89210335.14809726},
  {"PCA1": 2.848897882844415, "PCA2": 1.449560254364951, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Other", "tiempo_prestamo": 30.71047227926078, "tipo_ente": "Estado", "valor_usd": 100000000.0},
  {"PCA1": 3.531816385271717, "PCA2": 1.1466261628583498, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 30.62559890485969, "tipo_ente": "Estado", "valor_usd": 139880000.0},
  {"PCA1": 0.04976926597933248, "PCA2": -1.6793528242989813, "cluster": 0, "nombre_acreedor": "Kreditanstalt für Wiederaufbau", "sector": "Water supply - large systems", "tiempo_prestamo": 14.80355920602327, "tipo_ente": "Estado", "valor_usd": 56950000.0},
  {"PCA1": 0.804966684026578, "PCA2": 0.8853471728412383, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.54209445585215, "tipo_ente": "Estado", "valor_usd": 28000000.0},
  {"PCA1": 1.3125272259215042, "PCA2": 0.6808234477569478, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.70910335386722, "tipo_ente": "Estado", "valor_usd": 52156000.0},
  {"PCA1": 0.917114059212524, "PCA2": 0.9536043043458566, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.99383983572895, "tipo_ente": "Estado", "valor_usd": 31000000.0},
  {"PCA1": 3.2060805427111747, "PCA2": -0.1267854288086341, "cluster": 2, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 24.96098562628337, "tipo_ente": "Estado", "valor_usd": 150000000.0},
  {"PCA1": 0.522090586636646, "PCA2": -1.190457149830281, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Sanitation - large systems", "tiempo_prestamo": 18.00136892539357, "tipo_ente": "Estado", "valor_usd": 60000000.0},
  {"PCA1": 1.1868032718646486, "PCA2": 0.8760793135896848, "cluster": 2, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 24.98836413415469, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": 0.27366272080928433, "PCA2": -0.339983554802428, "cluster": 0, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Rural development", "tiempo_prestamo": 20.0684462696783, "tipo_ente": "Estado", "valor_usd": 38654612.36100478},
  {"PCA1": 0.5855876518725107, "PCA2": -1.4078504555005054, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Environmental policy and administrative management", "tiempo_prestamo": 18.072553045859, "tipo_ente": "Município", "valor_usd": 80000000.0},
  {"PCA1": -0.7058055871195335, "PCA2": -0.14638068808729093, "cluster": 1, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Urban development", "tiempo_prestamo": 20.13689253935661, "tipo_ente": "Município", "valor_usd": 4940613.821861228},
  {"PCA1": 0.39655200535365603, "PCA2": -1.2523360440280125, "cluster": 0, "nombre_acreedor": "CAF", "sector": "Other", "tiempo_prestamo": 17.99863107460643, "tipo_ente": "Município", "valor_usd": 70000000.0},
  {"PCA1": -1.0732376071627412, "PCA2": 0.7056825702950704, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.0485968514716, "tipo_ente": "Município", "valor_usd": 1265592.87227994},
  {"PCA1": -0.8577352240433926, "PCA2": 0.7997832511365607, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 21.99041752224504, "tipo_ente": "Município", "valor_usd": 922720.4653484686},
  {"PCA1": -1.1516719025363955, "PCA2": 0.5938530807024749, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.49828884325804, "tipo_ente": "Município", "valor_usd": 487910.7709375885},
  {"PCA1": -1.3574832190416697, "PCA2": -1.0288440366608473, "cluster": 0, "nombre_acreedor": "Agência de Fomento do Estado da Bahia S/A", "sector": "Other", "tiempo_prestamo": 14.85010266940452, "tipo_ente": "Município", "valor_usd": 527024.6530421034},
  {"PCA1": -0.8631616266018172, "PCA2": 0.6479782235687613, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 21.43737166324436, "tipo_ente": "Município", "valor_usd": 2878415.719987719},
  {"PCA1": -0.09297150821434765, "PCA2": 2.1378761678070273, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Other", "tiempo_prestamo": 28.27378507871321, "tipo_ente": "Município", "valor_usd": 2443028.573662198},
  {"PCA1": -1.0601361998504617, "PCA2": 0.6829403030575347, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.00205338809035, "tipo_ente": "Município", "valor_usd": 1225492.404039414},
  {"PCA1": -0.851798980371758, "PCA2": 0.9458441560520237, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 22.33264887063655, "tipo_ente": "Município", "valor_usd": 2621461.027612723},
  {"PCA1": 1.6867279015351495, "PCA2": 0.5598205842758682, "cluster": 2, "nombre_acreedor": "BID", "sector": "Other", "tiempo_prestamo": 24.99931553730321, "tipo_ente": "Estado", "valor_usd": 72700000.0},
  {"PCA1": 0.6161765843098227, "PCA2": -0.5803378700699601, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Other", "tiempo_prestamo": 20.0, "tipo_ente": "Estado", "valor_usd": 60000000.0},
  {"PCA1": -1.0440621302578263, "PCA2": 0.7811472692342815, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.37713894592745, "tipo_ente": "Município", "valor_usd": 857106.054326659},
  {"PCA1": -0.7325660500073632, "PCA2": -1.6107473851307532, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Environmental policy and administrative management", "tiempo_prestamo": 14.48870636550308, "tipo_ente": "Município", "valor_usd": 40000000.0},
  {"PCA1": -1.09879433133364, "PCA2": 0.7052348347539447, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 21.00205338809035, "tipo_ente": "Município", "valor_usd": 206008.7057978819},
  {"PCA1": -0.6008810616521171, "PCA2": 1.1635967000225853, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Water supply - large systems", "tiempo_prestamo": 24.10677618069815, "tipo_ente": "Município", "valor_usd": 1411207.751870351},
  {"PCA1": -1.097067526358055, "PCA2": 0.7024548339964319, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.99383983572895, "tipo_ente": "Município", "valor_usd": 395809.6946987889},
  {"PCA1": 0.7686596238496857, "PCA2": 2.1240290119737337, "cluster": 2, "nombre_acreedor": "Banco do Brasil S/A", "sector": "Sanitation - large systems", "tiempo_prestamo": 30.32443531827516, "tipo_ente": "Município", "valor_usd": 22278029.81205444},
  {"PCA1": 2.467363298139611, "PCA2": 0.14649826061778604, "cluster": 2, "nombre_acreedor": "BID", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 24.62696783025325, "tipo_ente": "Estado", "valor_usd": 118370000.0},
  {"PCA1": 1.182830848692483, "PCA2": 0.6671876716481374, "cluster": 2, "nombre_acreedor": "BID", "sector": "Formal sector financial intermediaries", "tiempo_prestamo": 24.62149212867899, "tipo_ente": "Estado", "valor_usd": 50000000.0},
  {"PCA1": 2.060265795920521, "PCA2": -1.033287144133346, "cluster": 2, "nombre_acreedor": "BIRF", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.0, "tipo_ente": "Estado", "valor_usd": 130000000.0},
  {"PCA1": 2.0387706127525185, "PCA2": 0.33983015939022104, "cluster": 2, "nombre_acreedor": "BID", "sector": "Education policy and administrative management", "tiempo_prestamo": 24.98015058179329, "tipo_ente": "Estado", "valor_usd": 90560000.0},
  {"PCA1": -0.7166585174908807, "PCA2": 1.0373745765487237, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 23.21149897330595, "tipo_ente": "Município", "valor_usd": 5077051.55936287},
  {"PCA1": -0.8376026359367674, "PCA2": 0.07915944257150287, "cluster": 1, "nombre_acreedor": "BADESUL Desenvolvimento S.A. - Agência de Fomento/RS", "sector": "Water supply - large systems", "tiempo_prestamo": 20.05201916495551, "tipo_ente": "Município", "valor_usd": 1875820.6715438},
  {"PCA1": -0.5776234976620028, "PCA2": 1.1799780057100973, "cluster": 1, "nombre_acreedor": "Caixa", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 23.98357289527721, "tipo_ente": "Município", "valor_usd": 7601717.593513348},
  {"PCA1": -0.6719783095470347, "PCA2": 0.05924997291135034, "cluster": 1, "nombre_acreedor": "Banco Nacional de Desenvolvimento Econômico e Social", "sector": "Transport policy, planning and administration", "tiempo_prestamo": 20.12320328542095, "tipo_ente": "Município", "valor_usd": 12884522.17465062},
  {"PCA1": -0.5652902308033002, "PCA2": -1.7178185534750614, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Urban development", "tiempo_prestamo": 15.02258726899384, "tipo_ente": "Município", "valor_usd": 42000000.0},
  {"PCA1": -0.7765733494160381, "PCA2": -1.384315349620331, "cluster": 0, "nombre_acreedor": "FONPLATA", "sector": "Other", "tiempo_prestamo": 15.00068446269678, "tipo_ente": "Município", "valor_usd": 30000000.0}
];

// Paleta de colores para clusters
const CLUSTER_COLORS = [
  '#c1121f', // cluster 0
  '#003049', // cluster 1
  '#ffb703', // cluster 2
  
];

function ScatterPlotClusters({ data, width = 650, height = 600 }) {
  const ref = useRef();
  const [hoveredCluster, setHoveredCluster] = useState(null);
  useEffect(() => {
    if (!data || data.length === 0) return;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    // Limpia SVG
    const d3 = window.d3;
    if (!d3) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    // Escalas
    const xExtent = d3.extent(data, d => d.PCA1);
    const yExtent = d3.extent(data, d => d.PCA2);
    const x = d3.scaleLinear().domain(xExtent).range([0, w]).nice();
    const y = d3.scaleLinear().domain(yExtent).range([h, 0]).nice();
    // Ejes
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + h})`)
      .call(d3.axisBottom(x).ticks(8))
      .call(g => g.selectAll('text').attr('font-size', 13));
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y).ticks(8))
      .call(g => g.selectAll('text').attr('font-size', 13));
    // Etiquetas de ejes
    svg.append('text')
      .attr('x', margin.left + w / 2)
      .attr('y', margin.top + h + 38)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', 15)
      .text('PCA 1');
    svg.append('text')
      .attr('x', margin.left - 36)
      .attr('y', margin.top + h / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', 15)
      .attr('transform', `rotate(-90,${margin.left - 36},${margin.top + h / 2})`)
      .text('PCA 2');
    // Tooltip
    let tooltip = d3.select('body').selectAll('.d3-tooltip-cluster').data([null]).join('div')
      .attr('class', 'd3-tooltip-cluster')
      .style('position', 'absolute')
      .style('background', 'rgba(255,255,255,0.97)')
      .style('border', '1.5px solid #c1121f')
      .style('border-radius', '7px')
      .style('padding', '10px 16px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('z-index', 2000)
      .style('color', '#222')
      .style('display', 'none');
    // Puntos
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.PCA1))
      .attr('cy', d => y(d.PCA2))
      .attr('r', 8)
      .attr('fill', d => CLUSTER_COLORS[d.cluster % CLUSTER_COLORS.length])
      .attr('stroke', '#222')
      .attr('stroke-width', 1.2)
      .attr('opacity', d =>
        hoveredCluster === null ? 0.85 : (d.cluster === hoveredCluster ? 1 : 0.2)
      )
      .on('mousemove', function(event, d) {
        setHoveredCluster(d.cluster);
        tooltip
          .style('display', 'block')
          .html(
            `<b>${d.nombre_acreedor}</b><br/>` +
            `<span style='color:#888'>Sector:</span> ${d.sector}<br/>` +
            `<span style='color:#888'>Tipo ente:</span> ${d.tipo_ente}<br/>` +
            `<span style='color:#888'>Tiempo préstamo:</span> ${d.tiempo_prestamo.toFixed(2)}<br/>` +
            `<span style='color:#888'>USD:</span> $${d.valor_usd.toLocaleString('es-ES', {maximumFractionDigits:0})}`
          )
          .style('left', (event.pageX + 18) + 'px')
          .style('top', (event.pageY - 24) + 'px');
        d3.select(this).attr('stroke-width', 3).attr('opacity', 1);
      })
      .on('mouseleave', function() {
        setHoveredCluster(null);
        tooltip.style('display', 'none');
        d3.select(this).attr('stroke-width', 1.2).attr('opacity', 0.85);
      });
    // Leyenda de clusters
    const clusters = Array.from(new Set(data.map(d => d.cluster))).sort();
    svg.append('g')
      .attr('transform', `translate(${margin.left + 10},${margin.top + 10})`)
      .selectAll('legend')
      .data(clusters)
      .join('g')
      .attr('transform', (d, i) => `translate(0,${i * 26})`)
      .each(function(d, i) {
        d3.select(this).append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', CLUSTER_COLORS[d % CLUSTER_COLORS.length])
          .attr('stroke', '#222');
        d3.select(this).append('text')
          .attr('x', 26)
          .attr('y', 13)
          .attr('font-size', 14)
          .attr('fill', '#222')
          .text('Cluster ' + d);
      });
    // Limpia tooltip al desmontar
    return () => { tooltip.remove(); };
  }, [data, width, height, hoveredCluster]);
  return <svg ref={ref} width={width} height={height} style={{ display: 'block' }} />;
}

// Tabla de insights para clusters
const CLUSTER_INSIGHTS = [
  {
    cluster: 0,
    color: '#c1121f',
    nombre: 'Desarrollo Urbano y Saneamiento',
    monto: '51,7 millones',
    plazo: '16,7',
    deudor: '72% Municipios<br/>28% Estados',
    sectores: 'Urban development (32%)<br/>Other (23%)<br/>Transport (11%)<br/>Sanitation (11%)<br/>Water supply (7%)',
    acreedores: 'CAF (37%)<br/>FONPLATA (25%)<br/>BNDES (7%)',
    insight: 'Proyectos urbanos y sanitarios, de monto medio-alto, con fuerte cofinanciamiento internacional y enfoque regional.'
  },
  {
    cluster: 1,
    color: '#003049',
    nombre: 'Crédito Municipal Tradicional',
    monto: '3,5 millones',
    plazo: '21,3',
    deudor: '99% Municipios',
    sectores: 'Transport policy (56%)<br/>Other (25%)<br/>Financieros (5%)<br/>Urban development (4%)',
    acreedores: 'Caixa (84%)<br/>Regional Extremo Sul (8%)',
    insight: 'Perfil clásico: municipios, bajo monto, infraestructura/transporte, Caixa como actor casi único.'
  },
  {
    cluster: 2,
    color: '#ffb703',
    nombre: 'Mega-Proyectos Estatales',
    monto: '74,3 millones',
    plazo: '25,4',
    deudor: '70% Estados<br/>30% Municipios',
    sectores: 'Other (40%)<br/>Transport (21%)<br/>Urban development (14%)<br/>Medical services (7%)',
    acreedores: 'BID (74%)<br/>BIRF (21%)',
    insight: 'Mega-operaciones estatales: gran escala, largo plazo, multilaterales dominantes, desarrollo regional/sectorial.'
  }
];

function ClusterInsightsTable() {
  return (
    <div style={{ width: 750, height: 480, margin: '0 auto', background: '#fff', borderRadius: 10, boxShadow: '0 4px 24px #0001', padding: '1.2rem 1.2rem 1.2rem 1.2rem', fontSize: 12, overflowY: 'auto', overflowX: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f7f7f9' }}>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111', fontSize: 12 }}>Cluster</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111', fontSize: 12 }}>Monto Promedio (USD)</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111', fontSize: 12 }}>Plazo Promedio (años)</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111', fontSize: 12 }}>Deudor</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111', fontSize: 12 }}>Sectores Principales</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111', fontSize: 12 }}>Acreedores Principales</th>
          </tr>
        </thead>
        <tbody>
          {CLUSTER_INSIGHTS.map(row => (
            <tr
              key={row.cluster}
              style={{ borderBottom: '1px solid #eee', background: '#fff', transition: 'background 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f3f3f7'; e.currentTarget.style.cursor = 'pointer'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.cursor = 'default'; }}
            >
              <td style={{ padding: '8px 6px', fontWeight: 600, color: row.color, fontSize: 12 }}> 
                {row.cluster}: {row.nombre}
              </td>
              <td style={{ padding: '8px 6px', fontWeight: 400 }}>{row.monto}</td>
              <td style={{ padding: '8px 6px', fontWeight: 400 }}>{parseInt(row.plazo, 10)}</td>
              <td style={{ padding: '8px 6px', fontWeight: 400 }} dangerouslySetInnerHTML={{__html: row.deudor}} />
              <td style={{ padding: '8px 6px', fontWeight: 400 }} dangerouslySetInnerHTML={{__html: row.sectores}} />
              <td style={{ padding: '8px 6px', fontWeight: 400 }} dangerouslySetInnerHTML={{__html: row.acreedores}} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClustersPage({ onBack, onNext }) {
  // No se usa API, los datos están embebidos
  const [vista, setVista] = useState('clusters'); // Siempre inicia en clusters
  const [d3Ready, setD3Ready] = useState(!!window.d3);
  useEffect(() => {
    if (!window.d3) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js';
      script.async = true;
      script.onload = () => setD3Ready(true);
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    } else {
      setD3Ready(true);
    }
  }, []);
  return (
    <div style={{ background: '#f7f7f9', padding: '0', position: 'relative' }}>
      {/* Barra superior con logo y botón */}
      <div style={{
        width: '100%',
        boxSizing: 'border-box',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20,
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 3.5rem 0.5rem 2.5rem',
        minHeight: 72,
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={fonpilogo} alt="Fonplata Logo" style={{ height: 48, marginRight: 12 }} />
        </div>
        <a
          href="https://sadipemxfonplata.streamlit.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#c1121f',
            fontWeight: 400,
            fontSize: '1.13rem',
            textDecoration: 'none',
            padding: 0,
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          Explorar Datos
        </a>
      </div>
      <div style={{ paddingTop: 12 }} />
      {/* Botón de flecha arriba */}
      <div
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            if (onBack) onBack();
          }, 1000);
        }}
        style={{
          position: 'fixed',
          top: 80,
          right: 32,
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
        }}
        aria-label="Volver arriba"
        title="Volver arriba"
      >
        <FaArrowUp style={{ fontSize: 36, color: '#c1121f' }} />
      </div>
      {/* Botón de flecha abajo */}
      <div
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          setTimeout(() => {
            if (onNext) onNext('oportunidades');
          }, 1000);
        }}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 32,
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
        }}
        aria-label="Ir a siguiente slide"
        title="Ir a siguiente slide"
      >
        <FaArrowUp style={{ fontSize: 36, color: '#c1121f', transform: 'rotate(180deg)' }} />
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'stretch', maxWidth: 1400, margin: '0 auto', padding: '0', flexWrap: 'wrap', height: 'calc(100vh - 72px)' }}>
        {/* Izquierda: Card descriptivo con título y texto */}
        <div
          style={{
            flex: 1,
            minWidth: 380,
            maxWidth: 480,
            background: '#fff',
            borderRadius: 0,
            boxShadow: '0 4px 24px #0001',
            border: 'none',
            marginLeft: 0,
            marginTop: '3.7rem',
            marginBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '2.5rem 2rem 2rem 2rem',
            boxSizing: 'border-box',
            height: '100%',
            minHeight: '100%',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            gap: '1.2rem',
            justifyContent: 'flex-start',
          }}
        >
          <h2 style={{ color: '#c1121f', fontWeight: 700, fontSize: '2rem', margin: '0 0 0.7rem 0', padding: 0, width: '100%' }}>
            Mercado Tripartito
          </h2>
          <div style={{ color: '#444', fontSize: '1.04rem', marginBottom: 18, lineHeight: 1.6 }}>
            El primer grupo incluye operaciones <b>urbanas y sanitarias</b> de mayor tamaño (72% municipios, 28% estados), con USD 51,7 millones de monto promedio y 16,7 años de plazo. <b>Destacan CAF y FONPLATA</b> como principales acreedores (37% y 25%), financiando desarrollo urbano, saneamiento y agua.<br /><br />
            El segundo grupo agrupa los <b>créditos municipales clásicos</b>: 99% municipios, con montos promedio de USD 3,5 millones y plazos de 21 años, enfocados sobre todo en transporte (56%) y financiados casi exclusivamente por Caixa (84%).<br /><br />
            El tercer grupo reúne los <b>mega-proyectos estatales</b> (70% estados, 30% municipios grandes), de USD 74,3 millones promedio y 25 años de plazo, con fuerte concentración en BID (74%) y BIRF (21%) como financiadores y enfoque en proyectos multifocales, transporte y salud.
          </div>
        </div>
        {/* Derecha: Header con título y botones alineados, y espacio para gráficos o insights */}
        <div style={{ flex: 1, minWidth: 350, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 0, paddingTop: 0, paddingLeft: 0, marginTop: '3.7rem' }}>
          {/* Header: solo los botones, sin título duplicado */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, width: '100%' }}>
            <div style={{ display: 'flex', gap: 32 }}>
              <span
                onClick={() => setVista('clusters')}
                style={{
                  cursor: 'pointer',
                  color: vista === 'clusters' ? '#c1121f' : '#888',
                  fontWeight: vista === 'clusters' ? 700 : 500,
                  fontSize: 18,
                  borderBottom: vista === 'clusters' ? '3px solid #c1121f' : '2px solid transparent',
                  padding: '4px 0',
                  transition: 'color 0.2s, border-bottom 0.2s',
                  letterSpacing: '0.01em',
                }}
              >Clusters</span>
              <span
                onClick={() => setVista('insights')}
                style={{
                  cursor: 'pointer',
                  color: vista === 'insights' ? '#c1121f' : '#888',
                  fontWeight: vista === 'insights' ? 700 : 500,
                  fontSize: 18,
                  borderBottom: vista === 'insights' ? '3px solid #c1121f' : '2px solid transparent',
                  padding: '4px 0',
                  transition: 'color 0.2s, border-bottom 0.2s',
                  letterSpacing: '0.01em',
                }}
              >Insights</span>
            </div>
          </div>
          {/* Visualización: gráfico o tabla, ambos del mismo tamaño visual */}
          <div style={{ width: '100%', height: 600, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.2rem', background: 'transparent' }}>
            {vista === 'clusters' ? (
              d3Ready ? <ScatterPlotClusters data={CLUSTERS_DATA} width={750} height={600} /> : <div style={{color:'#888', fontSize:16}}>Cargando gráfico...</div>
            ) : (
              <div style={{ width: '100%' }}><ClusterInsightsTable /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 