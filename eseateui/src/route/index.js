
const index = () => import('@/views/home')
const login = () => import('@/views/login')
const OrgUser = () => import('@/views/org-user')
const OrgMenu = () => import('@/views/org-menu')
const OrgRole = () => import('@/views/org-role')
const OrgEmployee = () => import('@/views/org-employee')
const OrgOrganization = () => import('@/views/org-organization')
const OrgHouseRegis = () => import('@/views/org-houseRegis')
const OrgRentHouse = () => import('@/views/org-rentHouse')
const OrgRentAdvance = () => import('@/views/org-rentAdvance')
const OrgJobsManager = () => import('@/views/org-jobsManager')
// 台账编号
const OrgLedger = () => import('@/views/org-ledger')
// 代理合同
const OrgAgencyContract = () => import('@/views/org-agencyContract')
// 代理合同 > 详情
const OrgAgencyContractDetail = () => import('@/views/org-agencyContract/detail.vue')
// 租赁合同
const OrgLeaseContract = () => import('@/views/org-leaseContract')
// 到期合同
const orgExpirationContract = () => import('@/views/org-expirationContract')
// 预收房租
const orgPrepaidRent = () => import('@/views/org-prepaidRent')
//预付房租
const orgCollectRent = () => import('@/views/org-collectRent')
//合同收入
const orgContractIncome = () => import('@/views/org-contractIncome')
//合同支出
const orgContractExpenditure = () => import('@/views/org-contractExpenditure')
//租户押金
const orgTenantDeposit = () => import('@/views/org-tenantDeposit')
//业主押金
const orgOwnerDeposit = () => import('@/views/org-ownerDeposit')
//办公收入
const orgOfficeIncome = () => import('@/views/org-officeIncome')
//办公支出
const orgOfficeExpenditure = () => import('@/views/org-officeExpenditure')
//临时帐
const orgTempAccount = () => import('@/views/org-tempAccount')
//流水管理
const orgPipelineManagement = () => import('@/views/org-pipelineManagement')
//客户资料
const ownerInfo = () => import('@/views/ownerInfo')
//bug反馈
const tenantInfo = () => import('@/views/tenantInfo')
//实际业绩
const actualPerformance = () => import('@/views/ActualPerformance')
//合同台账
const contractLedger = () => import('@/views/contractLedger')
// 工资核算
const wageAccount = () => import('@/views/WageAccount')
// 考勤统计
const AttendanceStatistics = () => import('@/views/AttendanceStatistics')
// 考勤报表
const AttendanceReport = () => import('@/views/AttendanceReport')
// 水电费设置
const UtilityBillManage = () => import('@/views/UtilityBillManage')
// 水电费详情
const UtilityBillDetails = () => import('@/views/UtilityBillDetails')
// 开单统计
const BillingStatistics = () => import('@/views/BillingStatistics')
// 添加账单
const AddBill = () => import('@/views/AddBill')
// 利润报表
const ProfitStatement = () => import('@/views/ProfitStatement')


let routes = [{
	path: '/login',
	name: 'login',
	component: login
},
{
	path: '/',
	component: index,
	redirect: '/employee',
	meta: {
		title: '首页'
	},
	children: [{
		path: '/user',
		name: 'OrgUser',
		component: OrgUser,
		meta: {
			title: '用户信息'
		}
	}, {
		path: '/ownerInfo',
		name: 'ownerInfo',
		component: ownerInfo,
		meta: {
			title: '客户资料'
		}
	}, {
		path: '/tenantInfo',
		name: 'tenantInfo',
		component: tenantInfo,
		meta: {
			title: 'Bug反馈'
		}
	}, {
		path: '/contractLedger',
		name: 'contractLedger',
		component: contractLedger,
		meta: {
			title: '合同台账'
		}
	}, {
		path: '/actualPerformance',
		name: 'actualPerformance',
		component: actualPerformance,
		meta: {
			title: '实际业绩'
		}
	}, {
		path: '/wageAccount',
		name: 'wageAccount',
		component: wageAccount,
		meta: {
			title: '工资核算'
		}
	}, {
		path: '/menu',
		name: 'OrgMenu',
		component: OrgMenu,
		meta: {
			title: '菜单管理'
		}
	}, {
		path: '/role',
		name: 'OrgRole',
		component: OrgRole,
		meta: {
			title: '角色权限'
		}
	}, {
		path: '/employee',
		name: 'OrgEmployee',
		component: OrgEmployee,
		meta: {
			title: '员工管理'
		}
	}, {
		path: '/jobsManager',
		name: 'OrgJobsManager',
		component: OrgJobsManager,
		meta: {
			title: '岗位管理'
		}
	}, {
		path: '/organization',
		name: 'OrgOrganization',
		component: OrgOrganization,
		meta: {
			title: '部门管理'
		}
	}, {
		path: '/houseRegis',
		name: 'OrgHouseRegis',
		component: OrgHouseRegis,
		meta: {
			title: '楼盘字典'
		}
	}, {
		path: '/rentHouse',
		name: 'OrgRentHouse',
		component: OrgRentHouse,
		meta: {
			title: '房源查询'
		}
	}, {
		path: '/rentAdvance',
		name: 'OrgRentAdvance',
		component: OrgRentAdvance,
		meta: {
			title: '预付房租'
		}
	}, {
		path: '/ledger',
		name: 'OrgLedger',
		component: OrgLedger,
		meta: {
			title: '台账编号'
		}
	}, {
		path: '/agencyContract',
		name: 'OrgAgencyContract',
		component: OrgAgencyContract,
		meta: {
			title: '代理合同'
		}
	}, {
		path: '/newAgencyContract',
		name: 'newAgencyContract',
		component: OrgAgencyContractDetail,
		meta: {
			title: '新增代理合同'
		}
	}, {
		path: '/editAgencyContract/:id',
		name: 'editAgencyContract',
		component: OrgAgencyContractDetail,
		meta: {
			title: '修改代理合同'
		}
	}, {
		path: '/agencyContractDetail/:id',
		name: 'agencyContractDetail',
		component: OrgAgencyContractDetail,
		meta: {
			title: '查看合同'
		}
	}, {
		path: '/leaseContract',
		name: 'OrgLeaseContract',
		component: OrgLeaseContract,
		meta: {
			title: '租赁合同'
		}
	}, {
		path: '/expirationContract',
		name: 'orgExpirationContract',
		component: orgExpirationContract,
		meta: {
			title: '到期合同'
		}
	}, {
		path: '/prepaidRent',
		name: 'orgPrepaidRent',
		component: orgPrepaidRent,
		meta: {
			title: '预收房租'
		}
	}, {
		path: '/collectRent',
		name: 'orgCollectRent',
		component: orgCollectRent,
		meta: {
			title: '预付房租'
		}
	}, {
		path: '/contractIncome',
		name: 'orgContractIncome',
		component: orgContractIncome,
		meta: {
			title: '合同收入'
		}
	}, {
		path: '/contractExpenditure',
		name: 'orgContractExpenditure',
		component: orgContractExpenditure,
		meta: {
			title: '合同支出'
		}
	}, {
		path: '/tenantDeposit',
		name: 'orgTenantDeposit',
		component: orgTenantDeposit,
		meta: {
			title: '租户押金'
		}
	}, {
		path: '/ownerDeposit',
		name: 'orgOwnerDeposit',
		component: orgOwnerDeposit,
		meta: {
			title: '业主押金'
		}
	}, {
		path: '/officeIncome',
		name: 'orgOfficeIncome',
		component: orgOfficeIncome,
		meta: {
			title: '办公收入'
		}
	}, {
		path: '/officeExpenditure',
		name: 'orgOfficeExpenditure',
		component: orgOfficeExpenditure,
		meta: {
			title: '办公支出'
		}
	}, {
		path: '/tempAccount',
		name: 'orgTempAccount',
		component: orgTempAccount,
		meta: {
			title: '临时帐'
		}
	}, {
		path: '/pipelineManagement',
		name: 'orgPipelineManagement',
		component: orgPipelineManagement,
		meta: {
			title: '流水管理'
		}
	}, {
		path: '/AttendanceStatistics',
		name: 'AttendanceStatistics',
		component: AttendanceStatistics,
		meta: {
			title: '考勤统计'
		}
	}, {
		path: '/AttendanceReport',
		name: 'AttendanceReport',
		component: AttendanceReport,
		meta: {
			title: '考勤报表'
		}
	}, {
		path: '/UtilityBillManage',
		name: 'UtilityBillManage',
		component: UtilityBillManage,
		meta: {
			title: '水电费设置'
		}
	}, {
		path: '/UtilityBillDetails',
		name: 'UtilityBillDetails',
		component: UtilityBillDetails,
		meta: {
			title: '水电费详情'
		}
	}, {
		path: '/BillingStatistics',
		name: 'BillingStatistics',
		component: BillingStatistics,
		meta: {
			title: '开单统计'
		}
	}, {
		path: '/AddBill',
		name: 'AddBill',
		component: AddBill,
		meta: {
			title: '添加账单'
		}
	}, {
		path: '/ProfitStatement',
		name: 'ProfitStatement',
		component: ProfitStatement,
		meta: {
			title: '利润报表'
		}
	}]
}
]

export default routes